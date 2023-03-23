import { NextFunction, Request, Response } from "express";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authType = (req.headers.authorization || '').split(' ')[0];
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const strauth = Buffer.from(b64auth, 'base64').toString();
  const splitIndex = strauth.indexOf(':');
  const login = strauth.substring(0, splitIndex);
  const password = strauth.substring(splitIndex + 1);

  if (authType === "Basic" && login === "admin" && password === "qwerty") {
    next();
  } else {
    res.status(CodeResponsesEnum.Unauthorized_401).send({ message: "Unauthorized" });
  };
};
