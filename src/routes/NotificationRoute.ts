import { Router } from 'express';
import NotificationController from 'controllers/NotificationController';
import { validate, ValidationRules } from "validators/validator";

const routes = Router();
const notificationController = new NotificationController();

// @route   GET /notifications
// @desc    Get all notifications
// @acess   Private
routes.get('/', notificationController.getAll);

// @route   POST /notifications/unviewed_notifications
// @desc    Get the number of unviewed notifications
// @acess   Private
routes.post('/unviewed_notifications', validate(ValidationRules.accountId), notificationController.getNumberOfUnviewed);

// @route   POST /notifications/me
// @desc    Get all notifications of logged user
// @acess   Private
routes.post('/me', validate(ValidationRules.accountId), notificationController.getAllLoggedUser);

// @route   PUT /notifications/set_notification_viewed/:notification_id
// @desc    Set viewed_flag of a notification to true
// @acess   Private
routes.put('/set_notification_viewed/:notification_id', validate(ValidationRules.notificationId), notificationController.setNotificationViewed);

export default routes;