import { Router } from 'express';
import { validate, ValidationRules } from "validators/validator";
import AdminController from 'controllers/AdminController';

const routes = Router();
const adminController = new AdminController();

// @route   PUT admin/accounts/
// @desc    Update an account balance
// @acess   ADMIN
routes.put('/accounts',
    validate(ValidationRules.account_id),
    validate(ValidationRules.transfer_value),
    adminController.updateAccountBalance
);

export default routes;