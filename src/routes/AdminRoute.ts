import { Router } from 'express';
import { validate, ValidationRules } from "validators/validator";
import AdminController from 'controllers/AdminController';

const routes = Router();
const adminController = new AdminController();

// @route   PUT admin/accounts/balance
// @desc    Update an account balance
// @acess   ADMIN
routes.put('/accounts/balance',
    validate(ValidationRules.accountId),
    validate(ValidationRules.balance),
    adminController.updateAccountBalance
);

// @route   PUT admin/users/resetattempt
// @desc    Reset n_attempt of an user
// @acess   ADMIN
routes.put('/users/resetattempt',
    validate(ValidationRules.userId),
    adminController.resetAttempt
);

// @route   PUT admin/users/unblock
// @desc    Unblock an user
// @acess   ADMIN
routes.put('/users/unblock',
    validate(ValidationRules.userId),
    adminController.unblockUser
);

export default routes;