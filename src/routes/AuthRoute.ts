import { Router } from 'express';
import AuthController from 'controllers/AuthController';
import { validate, ValidationRules } from "validators/validator";
import { authentication } from 'middlewares/auth';

const routes = Router();
const authController = new AuthController();

// @route   POST auth/login
// @desc    Login route
// @acess   Public
routes.post('/login',
    validate(ValidationRules.cpf),
    validate(ValidationRules.password),
    authController.verify
);

// @route   POST auth/logout
// @desc    Logout route
// @acess   Private
routes.post('/logout',
    authentication,
    authController.logout
);

export default routes;