import { Request, Response } from "express";
import { AccountIn, AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { getRandom } from "utils/numberUtil";
import UserModel from "models/UserModel";
import { UserOut } from "dtos/UsersDTO";

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

  get = async (req: Request, res: Response) => {
    try {
      const agency: string = req.params.agency
      const account_number: string = req.params.account_number;
      const newAccount: AccountOut | null = await accountModel.getByAgencyAndNumber(
        agency,
        account_number,
        { user_id: true, bank: true, agency: true, account_number: true }
      ) as AccountOut | null;
      
      if (!newAccount) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      const full_name: string | null = await userModel.get(newAccount.id, { full_name: true }) as string | null

      if (!full_name) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      res.status(200).json({
        full_name: full_name,
        bank: newAccount.bank,
        agency: newAccount.agency,
        account_number: newAccount.account_number
      })
    } catch (e) {
      console.log("Failed to get account", e);
      res.status(500).send({
        error: "ACC-02",
        message: "Failed to get account",
      });
    }
  };

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

  getAllByUser = async (req: Request, res: Response) => {
    try {
      const { cpf } : { cpf: string } = req.body;
      console.log('cpf: ', cpf);
      const userId: UserOut | null = await userModel.findByCPF(cpf, {id: true}) as UserOut | null;
      console.log('userId: ', userId);

      if (!userId) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      const accounts: AccountOut[] | null = await accountModel.getAllByUserId(userId.id, {bank: true, agency: true, account_number: true}) as AccountOut[] | null;
      res.status(200).json(accounts);
    } catch (e) {
      console.log("Server Error", e);
      res.status(500).send({
        error: "SRV-01",
        message: "Server Error",
      });
    }
  };
}