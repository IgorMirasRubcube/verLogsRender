import { Router } from 'express';
import TransferController from 'controllers/TransferController';
import { authentication } from 'middlewares/auth';
import { validate ,ValidationRules } from 'validators/validator';

const routes = Router();
const transferController = new TransferController();

// @route   GET transfers/:account_id?
// @desc    Get different extracts of an account
// @acess   Private
routes.get('/:account_id',
    validate(ValidationRules.accountId),
    validate(ValidationRules.extract),
    transferController.getExtract
);

// @route   GET transfers/detailed/:id
// @desc    Get details of a transfer
// @acess   Private
routes.get('/detailed/:transfer_id',
    validate(ValidationRules.transferId),
    transferController.getDetailed
);



// @route   PUT transfers/:transfer_id
// @desc    Cancel a scheduled transfer
// @acess   Private
routes.put('/:transfer_id',
    validate(ValidationRules.transferId),
    validate(ValidationRules.transferPassword),
    transferController.cancelScheduledTransfer
);



// @route   POST transfers/
// @desc    Create a transfer
// @acess   Private
routes.post('/',
    validate(ValidationRules.transfer),
    validate(ValidationRules.transferPassword),
    transferController.create
);

routes.get('/', transferController.getAll);
routes.put('/:id', transferController.updatePassword);
routes.delete('/:id', transferController.delete);

export default routes;