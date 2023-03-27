import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { usersService } from "../domains/usersService";
import { basicAuthMiddleware } from "../middlewares/basicAuthMiddleware";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { usersQueryRepository } from "../repositories/usersQueryRepository";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";

export const usersRouter = Router({});

export const loginValidationMiddleware = body("login").isString().trim().isLength({ min: 3, max: 10 }).matches("^[a-zA-Z0-9_-]*$").withMessage("Incorrect value for login");

export const passwordValidationMiddleware = body("password").isString().trim().isLength({ min: 6, max: 20 }).withMessage("Incorrect value for password");

export const emailValidationMiddleware = body("email").isString().trim().isLength({ min: 3, max: 40 }).matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$").withMessage("Incorrect value for email");

usersRouter.get('/', basicAuthMiddleware, async (req: Request, res: Response) => {
  const searchLoginTerm = req.query.searchLoginTerm;
  const searchEmailTerm = req.query.searchEmailTerm;
  const sortBy = req.query.sortBy;
  const sortDirection = req.query.sortDirection;
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;
  const users = await usersQueryRepository.getUsers({searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize});
  res.status(200).send(users);
});

usersRouter.post('/',
  basicAuthMiddleware,
  loginValidationMiddleware,
  passwordValidationMiddleware,
  emailValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;

    const newUser = await usersService.createUser(login, email, password, true);
    res.status(CodeResponsesEnum.Created_201).send(newUser);
  }
);

usersRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await usersService.deleteUser(id);
  if (result) {
    res.sendStatus(CodeResponsesEnum.No_content_204);
    return;
  }
  res.sendStatus(CodeResponsesEnum.Not_found_404);
});
