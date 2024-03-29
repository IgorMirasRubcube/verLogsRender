import { Request, Response } from "express";
import UserModel from "models/UserModel";

const userModel = new UserModel();

export default class AddressController {
    verifyUser = async (req: Request, res: Response) => {
        try {
          await Promise.all([ 
            userModel.verifyEmail(req.body.email),
            userModel.verifyCPF(req.body.cpf)
          ]);
          
          res.status(200);
        } catch (e) {
          console.log("Failed to create user", e);
          res.status(500).send({
            error: "USR-01",
            message: "Failed to create user",
          });
        }
      };

    ok = async (req: Request, res: Response) => {
        res.status(200).send('Sucess');
    };
}