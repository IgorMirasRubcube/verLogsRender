import { Router } from 'express';
import UserController from 'controllers/UserController';
import { authentication } from "middlewares/auth";
import { validate, ValidationRules } from "validators/validator";

const routes = Router();
const userController = new UserController();

// @route   POST users/
// @desc    Register an user
// @acess   Public
routes.post('/',
    validate(ValidationRules.userWithoutPassword),
    validate(ValidationRules.password),
    validate(ValidationRules.address),
    validate(ValidationRules.transferPassword),
    userController.create
);

// @route   POST users/forgot_password
// @desc    Send a forgot password email
// @acess   Public
routes.post('/forgot_password',
    validate(ValidationRules.cpf),
    userController.sendEmailForgotPassword
);

// @route   POST users/reset_password
// @desc    Reset user's password with the token sent to user's email
// @acess   Public
routes.post('/reset_password',
    validate(ValidationRules.cpf),
    validate(ValidationRules.forgotPasswordToken),
    validate(ValidationRules.password),
    userController.resetPassword
);

// @route   GET users/nameandcpf
// @desc    Get name and cpf of logged user
// @acess   Private
routes.get('/nameandcpf', authentication, userController.getNameAndCpf);

// @route   PUT users/password
// @desc    Update logged user's password
// @acess   Private
routes.put('/password',
    authentication,
    validate(ValidationRules.oldPassword),
    validate(ValidationRules.newPassword),
    userController.updatePassword
);

routes.get('/', authentication, userController.getAll)
routes.get('/:id', authentication ,userController.get);
routes.put('/:id', authentication ,userController.updatePassword);
routes.delete('/:id', authentication ,userController.delete);

export default routes;