import { Router } from 'express';

import { usersController } from '../controllers';

const usersRouter: Router = Router();

usersRouter.get('/', usersController.getAll);
usersRouter.get('/:id', usersController.getOne);

export default usersRouter;
