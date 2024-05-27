import { Request, Response } from "express";
import { NotificationIn, NotificationOut } from "dtos/NotificationsDTO";
import NotificationModel from "models/NotificationModel";

const notificationModel = new NotificationModel();

export default class NotificationController {
  getAll = async (req: Request, res: Response) => {
    try {
        const notifications: NotificationOut[] | null = await notificationModel
            .getAll() as NotificationOut[];
        
        res.status(200).json(notifications);
    } catch (e) {
      console.log("Server Error", e);
      res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  };

  getNumberOfUnviewed = async (req: Request, res: Response) => {
    try {
        const number_of_unviewed: number = await notificationModel.getNumberOfUnviewed(req.user.id);
        res.status(200).json(number_of_unviewed > 0);
    } catch (e) {
      console.log("Server Error", e);
      res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  };

  getAllLoggedUser = async (req: Request, res: Response) => {
    try {
        const notifications: NotificationOut[] | null = await notificationModel
            .getAllLoggedUser(req.user.id) as NotificationOut[];
        
        res.status(200).json(notifications);
    } catch (e) {
      console.log("Server Error", e);
      res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  };

}