import { Router } from "express";

import { usersController } from "../controllers";
import { requireLogin, updateUserInputValidation } from "../middlewares";

const userRouter: Router = Router();

userRouter.use(requireLogin);
userRouter
  .route("/")
  .get(usersController.getCurrent)
  .put(updateUserInputValidation, usersController.update)
  .delete(usersController.deleteOne);

export default userRouter;
