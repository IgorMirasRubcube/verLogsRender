import { Router } from 'express';
import AddressController from 'controllers/AddressController';

const routes = Router();
const addressController = new AddressController();

routes.post('/', addressController.create);
routes.get('/', addressController.getAll);
routes.get('/:id', addressController.get);
routes.put('/:id', addressController.update);
routes.delete('/:id', addressController.delete);

export default routes;