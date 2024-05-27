import { Router } from 'express';
import NotificationController from 'controllers/NotificationController';
import { validate, ValidationRules } from "validators/validator";

const routes = Router();
const notificationController = new NotificationController();

// @route   GET /notifications
// @desc    Get all notifications
// @acess   Private
routes.get('/', notificationController.getAll);

// @route   GET /notifications/unviewed_notifications
// @desc    Get the number of unviewed notifications
// @acess   Private
routes.get('/unviewed_notifications', notificationController.getNumberOfUnviewed);

export default routes;