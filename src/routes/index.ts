import { Router } from "express";

import authRouter from "./auth";
import postRouter from "./post";
import { verifyToken } from "../middlewares";

const router: Router = Router();

router.use(verifyToken);
router.use('/auth', authRouter)
router.use('/posts', postRouter)

export default router;
