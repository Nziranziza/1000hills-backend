import { Router } from "express";

import { postController } from "../controllers";
import {
  requireLogin,
  createPostInputValidation,
  updatePostInputValidation,
} from "../middlewares";

const postRouter: Router = Router();

postRouter
  .route("/")
  .post(requireLogin, createPostInputValidation, postController.create)
  .get(postController.getAll);

postRouter
  .route("/:id")
  .get(postController.getOne)
  .put(requireLogin, updatePostInputValidation, postController.update)
  .delete(requireLogin, postController.deleteOne);

export default postRouter;
