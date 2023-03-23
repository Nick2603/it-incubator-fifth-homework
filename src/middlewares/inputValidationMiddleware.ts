import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";

const customValidationResult = validationResult.withDefaults({
  formatter: error => {
    return {
      message: error.msg,
      field: error.param,
    };
  },
});

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    res.status(CodeResponsesEnum.Incorrect_values_400).json({ errorsMessages: errors.array({ onlyFirstError: true }) });
  } else {
    next();
  };
};
