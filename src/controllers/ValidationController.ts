import { Request, Response } from "express";
import UserModel from "models/UserModel";

const userModel = new UserModel();

export default class AddressController {
    verifyUser = async (req: Request, res: Response) => {
        try {
          const [emailRegistered, cpfRegistered] = await Promise.all([ 
            userModel.verifyEmail(req.body.email),
            userModel.verifyCPF(req.body.cpf)
          ]);
          
          if (emailRegistered || cpfRegistered){
            return res.status(500).send({
            error: "USR-01",
            message: "Failed to create user",
          });
          }

          res.status(200).send('Sucess');
        } catch (e) {
          console.log("Internal server error", e);
          res.status(500).send({
            message: "Internal server error",
          });
        }
      };

    ok = async (req: Request, res: Response) => {
        res.status(200).send('Sucess');
    };
}