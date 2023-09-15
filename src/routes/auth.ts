import { Router } from 'express';

import { authController } from '../controllers';

const authRouter: Router = Router();

authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.signup);
authRouter.get('/verify/:token', authController.verifyEmail)
authRouter.post('/forgot-password', authController.forgotPassword)
authRouter.post('/reset/:token', authController.resetPassword)

export default authRouter;
