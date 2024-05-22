import { Request, Response } from "express";
import { AccountIn, AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { UserOut } from "dtos/UsersDTO";
import { Prisma } from "@prisma/client";
import UserModel from "models/UserModel";

const accountModel = new AccountModel();
const userModel = new UserModel();

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

    resetAttempt = async (req: Request, res: Response) => {
        const user_id: string = req.body.user_id;

        try {
            const updatedUser: UserOut = await userModel.resetAttempt(user_id, {n_attempt: true});
            
            if (updatedUser && typeof updatedUser.n_attempt === 'number') {
                return res.status(200).json(updatedUser);
            }

            res.status(404).json({
                error: "USR-06",
                message: "User not found.",
            });
            
        } catch (e) {
            throw e;
        }
    }

    unblockUser = async (req: Request, res: Response) => {
        const user_id: string = req.body.user_id;

        try {
            const updatedUser: UserOut = await userModel.unblockUser(user_id,
                { blocked: true, n_attempt: true}
            );
            
            if (updatedUser && !updatedUser.blocked) {
                return res.status(200).json(updatedUser);
            }

            res.status(404).json({
                error: "USR-06",
                message: "User not found.",
            });
            
        } catch (e) {
            console.log("Failed to unblock user ", e);
            return res.status(500).send({
                error: "ADM-01",
                message: "Failed to unblock user",
            })
        }
    }

    unblockAccount = async (req: Request, res: Response) => {
        const account_id: string = req.body.account_id;

        try {
            const updatedAccount: UserOut = await accountModel.unblockAccount(account_id,
                { blocked: true, n_attempt: true}
            );
            
            if (updatedAccount && !updatedAccount.blocked) {
                return res.status(200).json(updatedAccount);
            }

            res.status(404).json({
                error: "ACC-06",
                message: "Account not found",
            });
            
        } catch (e) {
            console.log("Failed to unblock user ", e);
            return res.status(500).send({
                error: "ADM-02",
                message: "Failed to unblock account",
            })
        }
    }
}