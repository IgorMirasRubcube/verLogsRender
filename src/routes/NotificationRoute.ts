import { Router } from 'express';
import NotificationController from 'controllers/NotificationController';
import { validate, ValidationRules } from "validators/validator";

const routes = Router();
const notificationController = new NotificationController();

// @route   GET /notifications
// @desc    Get all notifications
// @acess   Private
routes.get('/', notificationController.getAll);

export default routes;