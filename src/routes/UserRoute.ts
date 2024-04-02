import { Router } from 'express';
import UserController from 'controllers/UserController';
import { authentication } from "middlewares/auth";
import { validate, ValidationRules } from "validators/validator";

const routes = Router();
const userController = new UserController();

// @route   POST users/
// @desc    Cadastrar um usuario
// @acess   Public
routes.post('/',
    validate(ValidationRules.userWithoutPassword),
    validate(ValidationRules.password),
    validate(ValidationRules.address),
    validate(ValidationRules.transferPassword),
    userController.create
);

routes.get('/', authentication ,userController.getAll);
routes.get('/:id', authentication ,userController.get);
routes.put('/:id', authentication ,userController.updatePassword);
routes.delete('/:id', authentication ,userController.delete);

export default routes;