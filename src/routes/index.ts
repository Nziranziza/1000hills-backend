import { Router } from "express";

import authRouter from "./auth";
import postRouter from "./post";
import userRouter from "./user";
import usersRouter from "./users";
import { verifyToken } from "../middlewares";

const router: Router = Router();

router.use(verifyToken);
router.use('/auth', authRouter)
router.use('/posts', postRouter)
router.use('/user', userRouter)
router.use('/users', usersRouter)

export default router;
