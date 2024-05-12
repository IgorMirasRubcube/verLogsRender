import { Router } from 'express';
import AccountController from 'controllers/AccountController';
import { validate, ValidationRules } from 'validators/validator';

const routes = Router();
const accountController = new AccountController();

routes.post('/', accountController.create);
routes.get('/', accountController.getAll);
routes.put('/:id', accountController.update);
routes.delete('/:id', accountController.delete);

// @route   GET accounts/:agency/:account_number
// @desc    Get an account by agency and account_number
// @acess   Private
routes.get('/:agency/:account_number',
    validate(ValidationRules.agency),
    validate(ValidationRules.account_number),
    accountController.getByAgencyAndNumber
);
    
// @route   GET accounts/myaccounts
// @desc    Get all accounts of logged user
// @acess   Private
routes.get('/myaccounts', accountController.getAllLoggedUser);


// @route   GET accounts/main
// @desc    Get balance and id of main account
// @acess   Private
routes.get('/main', accountController.main);

// @route   GET accounts/:account_id
// @desc    Get infos of an account and user by account_id
// @acess   Private
routes.get('/:account_id', validate(ValidationRules.accountId) ,accountController.getById);



// @route   PUT accounts/:account_id/transferpassword
// @desc    Update transfer password of an account
// @acess   Private
routes.put('/:account_id/transferpassword',
    validate(ValidationRules.transferPassword),
    validate(ValidationRules.accountId),
    accountController.update
);



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

export default routes;