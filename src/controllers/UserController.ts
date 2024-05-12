import { Request, Response } from "express";
import { UserIn, UserLoginOut, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import { MapTo } from 'utils/mapToUtil'
import { AddressIn } from "dtos/AddressesDTO";
import { AccountIn } from "dtos/AccountsDTO";
import CreateUser from "application/CreateUser";
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcryptjs'
import { getRandom } from "utils/numberUtil";
import mailer from "modules/mailer";

const userModel = new UserModel();

export default class UserController {
  create = async (req: Request, res: Response) => {
    const user: UserIn = MapTo.UserIn(req.body);
    const address: AddressIn = MapTo.AddressIn(req.body);
    let account: AccountIn = MapTo.AccountIn(req.body);
    const createUser = new CreateUser();
    
    try {
      let newUser: UserOut = await createUser.execute(user, address, account);
      const payload: JwtPayload = {
        user: {
            id: newUser.id,
            role: newUser.role,
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
      console.log("Failed to create user", e);
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create user",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const newUser: UserOut | null = await userModel.get(id) as UserOut | null;

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
      const users: UserOut[] | null = await userModel.getAll() as UserOut[];
      res.status(200).json(users);
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
    }
  };

  sendEmailForgotPassword = async (req: Request, res: Response) => {
    const cpf: string = req.body.cpf;

    try {
      const newUser: UserOut | null = await userModel.findByCPF(cpf,
        { id: true, email: true }
      ) as UserOut;

      if (!newUser?.id || !newUser?.email) {
        return res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }

      const token: string = getRandom(6);
      const now = new Date();
      now.setHours(now.getHours() + 1);

      await userModel.updatePasswordReset(newUser.id, token, now);

      const mailOptions = {
        from: 'rubbankteam@gmail.com',
        to: newUser.email,
        subject: 'Password Recovery',
        template: 'users/forgot_password',
        context: {
          token
        }
      }

      mailer.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send({
            error: "MAIL-01",
            message: "Failed to send email",
          });
        } else {
          return res.status(200).send();
        }
      });
    } catch (e) {
      return res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  }

  resetPassword = async (req: Request, res: Response) => {
    let { cpf, token, password } = req.body;

    try {
      const user: UserOut | null = await userModel.findByCPF(cpf,
        {
          id: true,
          password_reset_token: true,
          password_reset_expires: true,
        }
      );

      if (!user?.password_reset_token || !user?.password_reset_expires || !user?.id) {
        return res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }

      if (token !== user.password_reset_token) {
        return res.status(403).json({
          error: "TKN-01",
          message: "Token invalid"
        });
      }

      const now = new Date();

      if (now > user.password_reset_expires) {
        return res.status(403).json({
          error: "TKN-02",
          message: "Token expired, generate a new one"
        });
      }

      const salt = await genSalt(10);
      password = await hash(password, salt);

      const userUpdated: UserOut | null = await userModel.updatePassword(
        user.id,
        password
      ) as UserOut;

      res.status(200).send();
    } catch (e) {
      res.status(400).send({
        error: "USR-10",
        message: "Failed to reset password, please try again"
      })
    }
  }

  updatePassword = async (req: Request, res: Response) => {
    try {
      const id: string = req.user.id;
      let newPassword: string = req.body.new_password;
      const oldPassword: string = req.body.old_password;

      const user: UserOut | null = await userModel.get(id, { password: true });

      if (!user?.password) {
        return res.status(404).json({
          error: "USR-06",
          message: "User not found.",
      });
      }

      const isMatch = await compare(oldPassword, user.password);

      console.log('passou por aqui moso')

      if (!isMatch) {
        return res.status(403).json({
          error: "USR-11",
          message: "Wrong password",
        })
      }

      const salt = await genSalt(10);
      newPassword = await hash(newPassword, salt);

      const userUpdated: UserOut | null = await userModel.updatePassword(
        id,
        newPassword
      ) as UserOut;

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

  getNameAndCpf = async (req: Request, res: Response) => {
    try {
      console.log('UserId:', req.user.id);
      const newUser: UserOut | null = await userModel.get(req.user.id, {
        full_name: true, cpf: true
      }) as UserOut | null;

      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log('Erro: ', e);
      return res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const userDeleted: UserOut = await userModel.delete(id) as UserOut;
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