import { Request, Response, NextFunction, RequestHandler } from "express";
import { Schema } from "joi";

import { joiErrorCustomizer } from "../../utilities";
import {
  login,
  signup,
  forgotPassword,
  resetPassowrd,
} from "./joi-schema/auth";
import { create, update } from "./joi-schema/posts";
import { updateUser } from "./joi-schema/users";
import { HTTP_STATUS } from "../../constants";

const inputValidation =
  (schema: Schema): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const { error } = schema.validate(body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        errors: joiErrorCustomizer(error),
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
export const createPostInputValidation: RequestHandler =
  inputValidation(create);
export const updatePostInputValidation: RequestHandler =
  inputValidation(update);
export const updateUserInputValidation: RequestHandler =
  inputValidation(updateUser);
