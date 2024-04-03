import { Request, Response } from "express";
import { TransferIn, TransferOut } from "dtos/TransfersDTO";
import UserModel from "models/UserModel";
import { MapTo } from 'utils/mapToUtil'
import { AddressIn } from "dtos/AddressesDTO";
import { AccountIn } from "dtos/AccountsDTO";
import CreateTransfer from "application/CreateTransfer";
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const userModel = new UserModel();

export default class TransferController {
  create = async (req: Request, res: Response) => {
    const transfer: TransferIn = MapTo.TransferIn(req.body);
    const transfer_password: string = req.body.transfer_password;
    const createTransfer = new CreateTransfer();
    
    try {
      let balances: {} = await createTransfer.execute(transfer, transfer_password);
      res.status(201).json(balances);
    } catch (e) {
      console.log("Failed to create transfer", e);
      res.status(500).send({
        error: "TFR-01",
        message: "Failed to create transfer",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const newUser: UserOut | null = await userModel.get(id);

      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const users: UserOut[] | null = await userModel.getAll();
      res.status(200).json(users);
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
    }
  };

  updatePassword = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const password: string = req.body.password;
      const userUpdated: UserOut | null = await userModel.update(
        id,
        password
      );

      if (userUpdated) {
        res.status(200).json(userUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update user", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update user",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const userDeleted: UserOut = await userModel.delete(id);
      res.status(200).json(userDeleted);
    } catch (e) {
      console.log("Failed to delete user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete user",
      });
    }
  };
}