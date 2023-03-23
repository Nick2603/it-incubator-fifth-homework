import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { usersService } from "../domains/usersService";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";
import { passwordValidationMiddleware } from "./usersRouter";

export const authRouter = Router({});

export const loginOrEmailValidationMiddleware = body("loginOrEmail").isString().trim().isLength({ min: 1, max: 40 }).withMessage("Incorrect value for loginOrEmail");

authRouter.post('/login',
  loginOrEmailValidationMiddleware,
  passwordValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;
    const checkResult = await usersService.checkCredentials(loginOrEmail, password);

    if (!checkResult) {
      res.sendStatus(CodeResponsesEnum.Unauthorized_401);
      return;
    }
    
    res.sendStatus(CodeResponsesEnum.No_content_204);
  }
);
