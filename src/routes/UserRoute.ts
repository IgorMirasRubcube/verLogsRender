import { Router } from 'express';
import UserController from 'controllers/UserController';

const routes = Router();
const userController = new UserController();

routes.post('/', userController.createWithoutPassword);
routes.get('/', userController.getAll);
routes.get('/:id', userController.get);
routes.put('/:id', userController.updatePassword);
routes.delete('/:id', userController.delete);

export default routes;