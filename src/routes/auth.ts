import { Router } from "express";

import { authController } from "../controllers";
import {
  loginInputValidation,
  signupInputValidation,
  forgotPasswordInputValidation,
  resetPassowrdInputValidation,
} from "../middlewares";

const authRouter: Router = Router();

authRouter.post("/login", loginInputValidation, authController.login);
authRouter.post("/signup", signupInputValidation, authController.signup);
authRouter.get("/verify/:token", authController.verifyEmail);
authRouter.post(
  "/forgot-password",
  forgotPasswordInputValidation,
  authController.forgotPassword
);
authRouter.post(
  "/reset/:token",
  resetPassowrdInputValidation,
  authController.resetPassword
);

export default authRouter;
