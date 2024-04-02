import { Router } from 'express';
import LoginController from 'controllers/LoginController';
import { validate, ValidationRules } from "validators/validator";

const routes = Router();
const loginController = new LoginController();

routes.post('/',
    validate(ValidationRules.cpf),
    validate(ValidationRules.password),
    loginController.verify
);

export default routes;