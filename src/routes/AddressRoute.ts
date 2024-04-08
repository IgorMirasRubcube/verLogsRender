import { Router } from 'express';
import AddressController from 'controllers/AddressController';
import { ValidationRules, validate } from 'validators/validator';

const routes = Router();
const addressController = new AddressController();

routes.post('/', addressController.create);
routes.get('/', addressController.getAll);
routes.get('/:id', addressController.get);
routes.put('/', validate(ValidationRules.address), addressController.update);
routes.delete('/:id', addressController.delete);

export default routes;