import { Request, Response } from "express";
import { AccountIn, AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { UserOut } from "dtos/UsersDTO";
import { Prisma } from "@prisma/client";

const accountModel = new AccountModel();

export default class AdminController {
    updateAccountBalance = async (req: Request, res: Response) => {
        const account_id: string = req.body.account_id;
        const balance: Prisma.Decimal = req.body.balance;
        try {
            const updatedBalance: AccountOut = await accountModel.updateBalance(account_id, balance);

            if (!updatedBalance?.balance) {
                return res.status(404).json({
                    error: "ACC-06",
                    message: "Account not found",
                });
            }

            res.status(200).json(updatedBalance);
        } catch (e) {
            
        }
    }
}