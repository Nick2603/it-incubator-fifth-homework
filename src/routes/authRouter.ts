import { emailAdapter } from './../adapters/emailAdapter';
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { jwtService } from "../application/jwtService";
import { usersService } from "../domains/usersService";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";
import { passwordValidationMiddleware } from "./usersRouter";
import { authService } from '../domains/authService';

export const authRouter = Router({});

export const loginOrEmailValidationMiddleware = body("loginOrEmail").isString().trim().isLength({ min: 1, max: 40 }).withMessage("Incorrect value for loginOrEmail");

authRouter.post('/login',
  loginOrEmailValidationMiddleware,
  passwordValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;
    const user = await usersService.checkCredentials(loginOrEmail, password);

    if (!user) {
      res.sendStatus(CodeResponsesEnum.Unauthorized_401);
      return;
    }
    
    const token = await jwtService.createJWT(user);
    res.status(CodeResponsesEnum.Ok_200).send(token);
  }
);

authRouter.get('/me', jwtAuthMiddleware, async (req: Request, res: Response) => {
  res.send({ email: req.user!.accountData.email, login: req.user!.accountData.login, userId: req.user!._id });
});

authRouter.post('/registration', async(req: Request, res: Response) => {
  const login = req.body.login;
  const email = req.body.email;
  const password = req.body.password;

  const user = await authService.createUser(login, email, password);
  res.send(user);
});

// authRouter.post('/test', async(req: Request, res: Response) => {
//   const to = req.body.email;
//   const subject = req.body.subject;
//   const html = req.body.message;
    
//   await emailAdapter.sendEmail(to, subject, html)

//   res.send("T");
// });
