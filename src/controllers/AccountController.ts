import { Request, Response } from "express";
import { AccountIn, AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { getRandom } from "utils/numberUtil";
import UserModel from "models/UserModel";
import { UserOut } from "dtos/UsersDTO";
import { Prisma } from "@prisma/client";
import { genSalt, hash } from 'bcryptjs'
import { hasBirthDate } from "utils/validationUtil"

const accountModel = new AccountModel();
const userModel = new UserModel();

export default class AccountController {
  create = async (req: Request, res: Response) => {
    try {
      let account: AccountIn = req.body;
      account.account_number = getRandom(8);
      const newAccount: AccountOut = await accountModel.create(account);
      res.status(201).json(newAccount);
    } catch (e) {
      console.log("Failed to create account", e);
      res.status(500).send({
        error: "ACC-01",
        message: "Failed to create account",
      });
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const account_id: string = req.params.account_id;
      const account: AccountOut | null = await accountModel.get(account_id,
        { user_id: true, account_number: true, agency: true, bank: true, blocked: true, type: true }
      );

      if (account?.user_id && req.user.id !== account.user_id) {
        return res.status(403).json({
          error: "USR-08",
          message: "Not authorized"
        });
      }
      if (!account?.user_id) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      const user: UserOut | null = await userModel.get(account.user_id, 
        { full_name: true, cpf: true }
      );

      if (!user?.full_name || !user?.cpf) {
        return res.status(500).send({
          error: "SRV-01",
          message: "Server Error",
        });
      }

      res.status(200).json({
        account_number: account.account_number,
        agency: account.agency,
        bank: account.bank,
        type: account.type,
        account_blocked: account.blocked,
        full_name: user.full_name,
        cpf: user.cpf
      });
    } catch (e) {
      console.log("Failed to create account", e);
      res.status(500).send({
        error: "ACC-01",
        message: "Failed to create account",
      });
    }
  }

  verifyEnoughBalance = async (req: Request, res: Response) => {
    try {
      const id: string = req.body.id;
      const transfer_value: number = req.body.transfer_value
      const newAccount: AccountOut | null = await accountModel.get(id, { balance: true }) as AccountOut | null;

      if (!newAccount?.balance) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      const balanceDecimal = new Prisma.Decimal(newAccount.balance).toNumber();

      if (balanceDecimal < transfer_value) {
        return res.status(400).json({
          error: "TFR-07",
          message: "Not enough balance"
        });
      }

      res.status(200).send('Sucess');
    } catch (e) {
      console.log("Server Error", e);
      res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  }

  main = async (req: Request, res: Response) => {
    try {
      const newAccount: AccountOut | null = await accountModel.me(req.user.id,
         { balance: true, id: true }) as AccountOut | null;

      if (!newAccount?.balance) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      res.status(200).json(newAccount);
    } catch (e) {
      console.log("Server Error", e);
      res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const accounts: AccountOut[] | null = await accountModel.getAll();
      res.status(200).json(accounts);
    } catch (e) {
      console.log("Failed to get all accounts", e);
      res.status(500).send({
        error: "ACC-03",
        message: "Failed to get all accounts",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const account_id: string = req.params.account_id;
      let transfer_password: string = req.body.transfer_password;
      
      const account: AccountOut | null = await accountModel.get(account_id, {
        user_id: true, blocked: true
      });

      if (!account?.user_id) {
        return res.status(500).send({
          error: "SRV-01",
          message: "Server Error",
        });
      }

      if (account.blocked) {
        return res.status(403).json({
          error: "ACC-09",
          message: "ACCOUNT BLOCKED"
        });
      }

      if (account.user_id !== req.user.id) {
        return res.status(403).json({
          error: "USR-08",
          message: "Not authorized"
        });
      }

      const user: UserOut | null = await userModel.get(req.user.id, {birth_date: true}) as UserOut;

      if (!user?.birth_date) {
        return res.status(500).send({
          error: "SRV-01",
          message: "Server Error",
        });
      }

      if (hasBirthDate(transfer_password, user.birth_date)) {
        return res.status(422).json({
          error: "ACC-08",
          message: "Transfer password cannot have birth date infos",
        })
      }

      const salt = await genSalt(10);
      transfer_password = await hash(transfer_password, salt);

      const accountUpdated: AccountOut | null = await accountModel.update(
        account_id,
        transfer_password
      );

      if (accountUpdated) {
        res.status(200).json(accountUpdated);
      } else {
        res.status(404).json({
          error: "ACC-06",
          message: "Account not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update account", e);
      res.status(500).send({
        error: "ACC-04",
        message: "Failed to update account",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const accountDeleted = await accountModel.delete(id);
      res.status(204).json(accountDeleted);
    } catch (e) {
      console.log("Failed to delete account", e);
      res.status(500).send({
        error: "ACC-05",
        message: "Failed to delete account",
      });
    }
  };

  getByAgencyAndNumber = async (req: Request, res: Response) => {
    try {
      const agency: string = req.params.agency
      const account_number: string = req.params.account_number;
      const newAccount: AccountOut | null = await accountModel.getByAgencyAndNumber(
        agency,
        account_number,
        { id: true, user_id: true, bank: true, agency: true, account_number: true }
      ) as AccountOut | null;
      
      if (!newAccount?.user_id) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      const newUser: UserOut | null = await userModel.get(newAccount.user_id, { full_name: true }) as UserOut | null

      if (!newUser?.full_name) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      res.status(200).json({
        full_name: newUser.full_name,
        bank: newAccount.bank,
        agency: newAccount.agency,
        account_number: newAccount.account_number,
        account_id: newAccount.id
      });
    } catch (e) {
      console.log("Failed to get account", e);
      res.status(500).send({
        error: "ACC-02",
        message: "Failed to get account",
      });
    }
  };

  getAllByCPF = async (req: Request, res: Response) => {
    try {
      const { cpf } : { cpf: string } = req.body;
      const newUser: UserOut | null = await userModel.findByCPF(cpf, {id: true, full_name: true }) as UserOut | null;

      if (!newUser?.id) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      const accounts: AccountOut[] | null = await accountModel.getAllByUserId(newUser.id, {
        id: true, bank: true, agency: true, account_number: true, blocked: true
      }) as AccountOut[] | null;

      res.status(200).json({
        full_name: newUser.full_name,
        accounts: accounts
      });
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
      const user_id: string = req.user.id;

      const accounts: AccountOut[] | null = await accountModel.getAllByUserId(user_id, {
        id: true, bank: true, agency: true, account_number: true, blocked: true, type: true
      }) as AccountOut[] | null;

      res.status(200).json({
        accounts: accounts
      });
    } catch (e) {
      console.log("Server Error", e);
      res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  };
}