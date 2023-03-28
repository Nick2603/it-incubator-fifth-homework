import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwtService";
import { usersService } from "../domains/usersService";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";
import { IUserDBModel } from "../types/IUser";

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.sendStatus(CodeResponsesEnum.Unauthorized_401);
    return;
  };

  const token = req.headers.authorization.split(" ")[1];
  const userId = await jwtService.getUserIdByToken(token);

  if (!userId) {
    res.sendStatus(CodeResponsesEnum.Unauthorized_401);
    return;
  };

  req.user = await usersService.getUserDBModelById(userId) as IUserDBModel;
  next();
};
