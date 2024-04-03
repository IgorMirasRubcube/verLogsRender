import { Router } from 'express';
import TransferController from 'controllers/TransferController';
import { authentication } from 'middlewares/auth';
import { validate ,ValidationRules } from 'validators/validator';

const routes = Router();
const transferController = new TransferController();

// @route   POST transfer/
// @desc    Create a transfer
// @acess   Private
routes.post('/', validate(ValidationRules.transfer) ,transferController.create);
routes.get('/', transferController.getAll);
routes.get('/:id', transferController.get);
routes.put('/:id', transferController.updatePassword);
routes.delete('/:id', transferController.delete);

export default routes;