import { Request, Response } from "express";
import { UserLoginIn, UserLoginOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

const userModel = new UserModel();

export default class LoginController {
  verify = async (req: Request, res: Response) => {
    let user: UserLoginIn = req.body;
    
    try {
      const newUser: UserLoginOut | null = await userModel.findByCPF(user.cpf, {id: true, password: true}) as UserLoginOut | null;
      
      if (!newUser) {
        return res.status(401).json({
            error: "USR-07",
            message: "Invalid cpf and/or password",
          });
      }

      const isMatch = await compare(user.password, newUser.password);

      if (!isMatch){
        return res.status(401).json({
            error: "USR-07",
            message: "Invalid cpf and/or password",
          });
      }
      
      const payload: JwtPayload = {
        user: {
          id: newUser.id
        }
      };
    
      jwt.sign(
        payload,
          process.env.JWT_SECRET as Secret,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) throw err;
            res.status(201).json({ token })
          }
      );
    
    } catch (e) {
      console.log("Server Error", e);
      res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  };

}