import { Router } from 'express';
import UserController from 'controllers/UserController';
import { authentication } from "middlewares/auth";

const routes = Router();
const userController = new UserController();

// @route   POST users/
// @desc    Cadastrar um usuario
// @acess   Public
routes.post('/', userController.create);

routes.get('/', authentication, userController.getAll);
routes.get('/:id', authentication ,userController.get);
routes.put('/:id', authentication ,userController.updatePassword);
routes.delete('/:id', authentication ,userController.delete);

export default routes;