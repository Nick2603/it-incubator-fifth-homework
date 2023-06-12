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
import { blackListRefreshTokensService } from "../domains/blackListRefreshTokensService";

export const authRouter = Router({});

export const loginOrEmailValidationMiddleware = body("loginOrEmail").isString().trim().isLength({ min: 1, max: 40 }).withMessage("Incorrect value for loginOrEmail");

export const codeValidationMiddleware = body("code").isString().trim().isLength({ min: 1, max: 500 }).withMessage("Incorrect value for code");

const emailUniquenessValidationMiddleware = body("email").custom(isUniqueEmail);

const loginUniquenessValidationMiddleware = body("login").custom(isUniqueLogin);

authRouter.post('/login',
  loginOrEmailValidationMiddleware,
  passwordValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;
    const user = await authService.checkCredentials(loginOrEmail, password);    

    if (!user) {
      res.sendStatus(CodeResponsesEnum.Unauthorized_401);
      return;
    }
    
    const accessToken = await jwtService.createJWTAccessToken(user);
    const refreshToken = await jwtService.createJWTRefreshToken(user);
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 20 }).status(CodeResponsesEnum.Ok_200).send(accessToken);
  }
);

authRouter.get('/me', bearerAuthMiddleware, async (req: Request, res: Response) => {
  res.send({ email: req.user!.accountData.email, login: req.user!.accountData.login, userId: req.user!._id });
});

authRouter.post('/registration',
  emailUniquenessValidationMiddleware,
  loginUniquenessValidationMiddleware,
  loginValidationMiddleware,
  passwordValidationMiddleware,
  emailValidationMiddleware,
  inputValidationMiddleware,
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
  async(req: Request, res: Response) => {
    const code = req.body.code;

    const result = await authService.confirmEmail(code);
    if (result === false) return res.send(CodeResponsesEnum.Incorrect_values_400);
    if (typeof result !== "boolean") return res.status(CodeResponsesEnum.Incorrect_values_400).send(result);
    res.sendStatus(CodeResponsesEnum.No_content_204);
  }
);

authRouter.post('/registration-email-resending', emailValidationMiddleware, async(req: Request, res: Response) => {
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

  const isTokenInBlackList = await blackListRefreshTokensService.checkIfTokenInBlackList(refreshTokenFromReq);

  if (isTokenInBlackList) {
    return res.status(401).send('Access Denied. Incorrect refresh token provided.');
  };

  const dbUser = await usersService.getUserDBModelById(userId);

  if (!dbUser) {
    return res.status(401).send('User not found.');
  };

  const user = mapUserDBTypeToViewType(dbUser);

  await blackListRefreshTokensService.addRefreshTokenToBlackList(refreshTokenFromReq);

  const accessToken = await jwtService.createJWTAccessToken(user);
  const refreshToken = await jwtService.createJWTRefreshToken(user);
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

  const isTokenInBlackList = await blackListRefreshTokensService.checkIfTokenInBlackList(refreshTokenFromReq);

  if (isTokenInBlackList) {
    return res.status(401).send('Access Denied. Incorrect refresh token provided.');
  };

  await blackListRefreshTokensService.addRefreshTokenToBlackList(refreshTokenFromReq);

  res.sendStatus(CodeResponsesEnum.No_content_204);
});
