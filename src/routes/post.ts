import { Router } from "express";

import { postController } from "../controllers";
import { requireLogin } from "../middlewares";

const postRouter: Router = Router();

postRouter
  .route("/")
  .post(requireLogin, postController.create)
  .get(postController.getAll);

postRouter
  .route("/:id")
  .get(postController.getOne)
  .put(requireLogin, postController.update)
  .delete(requireLogin, postController.deleteOne);

export default postRouter;
