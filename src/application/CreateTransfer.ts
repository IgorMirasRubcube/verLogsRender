import { AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { TransferIn } from "dtos/TransfersDTO";
import TransferModel from "models/TransferModel";
import { Prisma } from "@prisma/client";
import { compare } from "bcryptjs";

export default class CreateTransfer {
    constructor () {

    }

    async execute(transfer: TransferIn, transfer_password: string): Promise<{}> {
        const transferModel = new TransferModel();
        const accountModel = new AccountModel();

        if (transfer.from_account_id === transfer.to_account_id) {
            throw new Error('You cannot transfer to your own account')
        }

        try {
            const fromAccount: AccountOut | null = await accountModel.get(transfer.from_account_id, {
                balance: true, transfer_password: true
            }) as AccountOut | null;
            
            if (!fromAccount?.balance || !fromAccount?.transfer_password) {
                throw new Error('From account not found');
            }

            const isMatch = await compare(transfer_password, fromAccount.transfer_password);

            if (!isMatch) {
                throw new Error('Wrong password');
            }

            const toAccount: AccountOut | null = await accountModel.get(transfer.to_account_id, {
                balance: true
            }) as AccountOut | null;

            if (!toAccount?.balance) {
                throw new Error('To account not found');
            }

            if (fromAccount.balance < toAccount.balance){
                throw new Error('Account do not have enough balance');
            }

            transfer.is_scheduled ? transfer.status = "SCHEDULED" : transfer.status = "COMPLETED";

            await transferModel.create(transfer);
            
            if (transfer.is_scheduled) {
                return {};
            } else {
                const fromAccountNewBalance = Number(fromAccount.balance) - Number(transfer.value); 
                const toAccountNewBalance = Number(toAccount.balance) + Number(transfer.value); 

                const [fromBalanceUpdated, toBalanceUpdated] = await Promise.all([
                    accountModel.updateBalance(transfer.from_account_id, new Prisma.Decimal(fromAccountNewBalance)),
                    accountModel.updateBalance(transfer.to_account_id, new Prisma.Decimal(toAccountNewBalance))
                ]);

                return {
                    from_account_old_balance: fromAccount.balance,
                    from_account_new_balance: fromBalanceUpdated,
                    to_account_old_balance: toAccount.balance,
                    to_account_new_balance: toBalanceUpdated
                };
            }
        } catch (e) {
            throw e;
        }
    }
}