import { Router } from 'express';
import TransferController from 'controllers/TransferController';
import { authentication } from 'middlewares/auth';

const routes = Router();
const transferController = new TransferController();

// @route   POST transfer/
// @desc    Create a transfer
// @acess   Private
routes.post('/', transferController.create);
routes.get('/', transferController.getAll);
routes.get('/:id', transferController.get);
routes.put('/:id', transferController.updatePassword);
routes.delete('/:id', transferController.delete);

export default routes;