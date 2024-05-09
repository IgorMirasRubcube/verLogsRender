import { Router } from 'express';
import { validate, ValidationRules } from "validators/validator";
import ValidationController from 'controllers/ValidationController';

const routes = Router();
const validationController = new ValidationController();

// @route   POST validations/user
// @desc    Verify user data
// @acess   Public
routes.post('/user',
                validate(ValidationRules.email),
                validate(ValidationRules.cpf),
                validationController.verifyUser
            );

// @route   POST validations/address
// @desc    Verify address data
// @acess   Public
routes.post('/address', validate(ValidationRules.address), validationController.ok);

// @route   POST validations/password
// @desc    Verify if a password match the rules
// @acess   Public
routes.post('/password', validate(ValidationRules.password), validationController.ok);

// @route   POST validations/transferpassword
// @desc    Verify if a password match the rules
// @acess   Public
routes.post('/transferpassword', validate(ValidationRules.transferPassword), validationController.ok);

export default routes;