import { Router } from 'express';
import AccountController from 'controllers/AccountController';
import { validate, ValidationRules } from 'validators/validator';

const routes = Router();
const accountController = new AccountController();

routes.post('/', accountController.create);
routes.get('/', accountController.getAll);

// @route   GET accounts/:agency/:account_number
// @desc    Get an account by agency and account_number
// @acess   Private
routes.get('/:agency/:account_number',
    validate(ValidationRules.agency),
    validate(ValidationRules.account_number),
    accountController.getByAgencyAndNumber
);

routes.put('/:id', accountController.update);
routes.delete('/:id', accountController.delete);

// @route   POST accounts/cpf
// @desc    Get all user accounts by cpf
// @acess   Private
routes.post('/cpf',
    validate(ValidationRules.cpf),
    accountController.getAllByCPF
);

// @route   POST accounts/balance
// @desc    Verify if account balance is equal or greater transfer_value
// @acess   Private
routes.post('/balance',
    validate(ValidationRules.transferValue),
    validate(ValidationRules.accountId),
    accountController.verifyEnoughBalance
);

// @route   POST accounts/me
// @desc    Get balance of main account
// @acess   Private
routes.get('/me', accountController.me);

export default routes;