import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { jwtService } from "../application/jwtService";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { bearerAuthMiddleware } from "../middlewares/bearerAuthMiddleware";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";
import { emailValidationMiddleware, loginValidationMiddleware, passwordValidationMiddleware } from "./usersRouter";
import { authService } from '../domains/authService';
import { isUniqueEmail } from "../middlewares/isUniqueEmailMiddleware";
import { isUniqueLogin } from "../middlewares/isUniqueLoginMiddleware";
import { usersService } from "../domains/usersService";
import { mapUserDBTypeToViewType } from "../mappers/mapUserDBTypeToViewType";
import { sessionsService } from "../domains/sessionsService";
import { createRateLimitingMiddleware } from "../middlewares/rateLimitingMiddleware";
import { recoveryCodesService } from "../domains/recoveryCodesService";
import { usersRepository } from "../repositories/usersRepository";

export const authRouter = Router({});

export const loginOrEmailValidationMiddleware = body("loginOrEmail").isString().trim().isLength({ min: 1, max: 40 }).withMessage("Incorrect value for loginOrEmail");

export const codeValidationMiddleware = body("code").isString().trim().isLength({ min: 1, max: 500 }).withMessage("Incorrect value for code");

const emailUniquenessValidationMiddleware = body("email").custom(isUniqueEmail);

const loginUniquenessValidationMiddleware = body("login").custom(isUniqueLogin);

export const newPasswordValidationMiddleware = body("newPassword").isString().trim().isLength({ min: 6, max: 20 }).withMessage("Incorrect value for password");

const loginRateLimitingMiddleware = createRateLimitingMiddleware(1000 * 10, 5);
const registrationRateLimitingMiddleware = createRateLimitingMiddleware(1000 * 10, 5);
const registrationConfirmationRateLimitingMiddleware = createRateLimitingMiddleware(1000 * 10, 5);
const emailResendingRateLimitingMiddleware = createRateLimitingMiddleware(1000 * 10, 5);
const passwordRecoveryRateLimitingMiddleware = createRateLimitingMiddleware(1000 * 10, 5);
const newPasswordReqRateLimitingMiddleware = createRateLimitingMiddleware(1000 * 10, 5);

authRouter.post('/login',
  loginOrEmailValidationMiddleware,
  passwordValidationMiddleware,
  inputValidationMiddleware,
  loginRateLimitingMiddleware,
  async (req: Request, res: Response) => {
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;
    const user = await authService.checkCredentials(loginOrEmail, password);
    const { ip } = req;
    const deviceTitle = req.headers["user-agent"] || "myDevice";

    if (!user) {
      res.sendStatus(CodeResponsesEnum.Unauthorized_401);
      return;
    }
    
    const accessToken = await jwtService.createJWTAccessToken(user);
    const refreshToken = await jwtService.createJWTRefreshToken(user);

    await sessionsService.addSession(refreshToken, ip, deviceTitle, user.id.toString());

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 20 }).status(CodeResponsesEnum.Ok_200).send(accessToken);
  }
);

authRouter.get('/me', bearerAuthMiddleware, async (req: Request, res: Response) => {
  res.send({ email: req.user!.accountData.email, login: req.user!.accountData.login, userId: req.user!.id });
});

authRouter.post('/registration',
  emailUniquenessValidationMiddleware,
  loginUniquenessValidationMiddleware,
  loginValidationMiddleware,
  passwordValidationMiddleware,
  emailValidationMiddleware,
  inputValidationMiddleware,
  registrationRateLimitingMiddleware,
  async(req: Request, res: Response) => {
    const login = req.body.login;
    const email = req.body.email;
    const password = req.body.password;

    const result = await authService.createUser(login, email, password);
    if (!result) return res.sendStatus(CodeResponsesEnum.Incorrect_values_400);
    res.sendStatus(CodeResponsesEnum.No_content_204);
  }
);

authRouter.post('/registration-confirmation',
  codeValidationMiddleware,
  inputValidationMiddleware,
  registrationConfirmationRateLimitingMiddleware,
  async(req: Request, res: Response) => {
    const code = req.body.code;

    const result = await authService.confirmEmail(code);
    if (result === false) return res.send(CodeResponsesEnum.Incorrect_values_400);
    if (typeof result !== "boolean") return res.status(CodeResponsesEnum.Incorrect_values_400).send(result);
    res.sendStatus(CodeResponsesEnum.No_content_204);
  }
);

authRouter.post('/registration-email-resending', emailValidationMiddleware, emailResendingRateLimitingMiddleware, async(req: Request, res: Response) => {
  const email = req.body.email;

  const result = await authService.resendEmail(email);
  if (result === false) return res.sendStatus(CodeResponsesEnum.Incorrect_values_400);
  if (typeof result !== "boolean") return res.status(CodeResponsesEnum.Incorrect_values_400).send(result);
  res.sendStatus(CodeResponsesEnum.No_content_204);
});

authRouter.post('/refresh-token', async(req: Request, res: Response) => {
  const refreshTokenFromReq = req.cookies["refreshToken"];
  if (!refreshTokenFromReq) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  };

  const userId = await jwtService.getUserIdByToken(refreshTokenFromReq);
  if (!userId) {
    return res.status(401).send('Access Denied. Incorrect refresh token provided.');
  };

  const isRefreshTokenInSession = sessionsService.isRefreshTokenInSession(refreshTokenFromReq);

  if (!isRefreshTokenInSession) {
    return res.status(401).send('Access Denied. Incorrect refresh token provided.');
  };

  const dbUser = await usersService.getUserDBModelById(userId);

  if (!dbUser) {
    return res.status(401).send('User not found.');
  };

  const user = mapUserDBTypeToViewType(dbUser);

  const metadata = await jwtService.getRefreshTokenMetadata(refreshTokenFromReq);
  let deviceId: string = "";

  if (metadata) {
    deviceId  = metadata.deviceId;
  }

  const accessToken = await jwtService.createJWTAccessToken(user);
  const refreshToken = await jwtService.createJWTRefreshToken(user, deviceId);

  await sessionsService.updateSession(refreshTokenFromReq, refreshToken);

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 20 }).status(CodeResponsesEnum.Ok_200).send(accessToken);
});

authRouter.post('/logout', async(req: Request, res: Response) => {
  const refreshTokenFromReq = req.cookies["refreshToken"];
  if (!refreshTokenFromReq) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  };

  const userId = await jwtService.getUserIdByToken(refreshTokenFromReq);
  if (!userId) {
    return res.status(401).send('Access Denied. Incorrect refresh token provided.');
  };

  const isRefreshTokenInSession = sessionsService.isRefreshTokenInSession(refreshTokenFromReq);

  if (!isRefreshTokenInSession) {
    return res.status(401).send('Access Denied. Incorrect refresh token provided.');
  };

  await sessionsService.deleteSession(refreshTokenFromReq);
  res.clearCookie("refreshToken");
  res.sendStatus(CodeResponsesEnum.No_content_204);
});

authRouter.post("/password-recovery",
  emailValidationMiddleware,
  passwordRecoveryRateLimitingMiddleware,
  inputValidationMiddleware,
  async(req: Request, res: Response) => {
    const email = req.body.email;

    await recoveryCodesService.addRecoveryCode(email);

    res.sendStatus(CodeResponsesEnum.No_content_204);
  }
);

authRouter.post("/new-password",
  newPasswordValidationMiddleware,
  newPasswordReqRateLimitingMiddleware,
  inputValidationMiddleware,
  async(req: Request, res: Response) => {
    const newPassword = req.body.newPassword;
    const recoveryCode = req.body.recoveryCode;

    const validCode = await recoveryCodesService.validateRecoveryCode(recoveryCode);

    if (!validCode) return res.status(400).send({ errorsMessages: [{ message: "incorrect value for recoveryCode", field: "recoveryCode" }] });

    const user = await usersRepository.getUserByEmail(validCode.email);

    if (!user) return res.sendStatus(CodeResponsesEnum.Incorrect_values_400);

    const result = usersService.updateUserPassword(user.id, newPassword);

    if (!result) return res.sendStatus(CodeResponsesEnum.Incorrect_values_400);

    res.sendStatus(CodeResponsesEnum.No_content_204);
  }
);
