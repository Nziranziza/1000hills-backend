import { Router } from 'express';

import { usersController, postController } from '../controllers';

const usersRouter: Router = Router();

usersRouter.get('/', usersController.getAll);
usersRouter.get('/:id', usersController.getOne);
usersRouter.get('/:id/posts', postController.getAllForUser)

export default usersRouter;
