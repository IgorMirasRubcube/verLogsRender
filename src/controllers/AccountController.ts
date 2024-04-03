import { Request, Response } from "express";
import { AccountIn, AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { getRandom } from "utils/numberUtil";
import UserModel from "models/UserModel";
import { UserOut } from "dtos/UsersDTO";
import { Prisma } from "@prisma/client";

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
  };

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
      const id: string = req.params.id;
      const updateAccount: AccountIn = req.body;
      const accountUpdated: AccountOut | null = await accountModel.update(
        id,
        updateAccount
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
      console.log('cpf: ', cpf);
      const newUser: UserOut | null = await userModel.findByCPF(cpf, {id: true, full_name: true }) as UserOut | null;
      console.log('newUser: ', newUser);

      if (!newUser) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      const accounts: AccountOut[] | null = await accountModel.getAllByUserId(newUser.id, {
        id: true, bank: true, agency: true, account_number: true
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
}