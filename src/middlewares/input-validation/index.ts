import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectSchema } from "joi";

import { joiErrorCustomizer } from "../../utilities";
import {
  login,
  signup,
  forgotPassword,
  resetPassowrd,
} from "./joi-schema/auth";

const inputValidation =
  (schema: ObjectSchema): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const { error } = schema.validate(body);
    if (error) {
      return res.status(400).send({
        error: joiErrorCustomizer(error),
      });
    }
    return next();
  };

export const loginInputValidation: RequestHandler = inputValidation(login);
export const signupInputValidation: RequestHandler = inputValidation(signup);
export const forgotPasswordInputValidation: RequestHandler =
  inputValidation(forgotPassword);
export const resetPassowrdInputValidation: RequestHandler =
  inputValidation(resetPassowrd);
