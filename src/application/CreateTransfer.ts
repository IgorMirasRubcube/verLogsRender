import { AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { TransferIn, TransferOut } from "dtos/TransfersDTO";
import { NotificationIn, NotificationOut } from "dtos/NotificationsDTO";
import TransferModel from "models/TransferModel";
import { Prisma } from "@prisma/client";
import { compare } from "bcryptjs";
import { MapTo } from "utils/mapToUtil";
import NotificationModel from "models/NotificationModel";

export default class CreateTransfer {
    constructor () {

    }

    async execute(transfer: TransferIn, transfer_password: string, user_id: string): Promise<{}> {
        const transferModel = new TransferModel();
        const accountModel = new AccountModel();
        const notificationModel = new NotificationModel();

        if (transfer.from_account_id === transfer.to_account_id) {
            throw new Error('You cannot transfer to your own account')
        }

        try {
            const fromAccount: AccountOut | null = await accountModel.get(transfer.from_account_id, {
                balance: true, transfer_password: true, user_id: true, blocked: true
            }) as AccountOut;
            
            if (!fromAccount?.balance || !fromAccount?.transfer_password || !fromAccount?.user_id) {
                throw new Error('From account not found');
            }

            if (user_id !== fromAccount.user_id) {
                throw new Error('Not authorized');
            }
            
            const toAccount: AccountOut | null = await accountModel.get(transfer.to_account_id, {
                balance: true, user_id: true
            }) as AccountOut | null;

            if (!toAccount?.balance || !toAccount?.user_id) {
                throw new Error('To account not found');
            }
            
            if (Number(fromAccount.balance) < Number(transfer.value)) {
                throw new Error('Account do not have enough balance');
            }

            const isMatch = await compare(transfer_password, fromAccount.transfer_password);

            if (!isMatch) {
                const accountAttempt: AccountOut | null = await accountModel.incrementAttempt(
                    transfer.from_account_id, {n_attempt: true}
                ) as AccountOut;

                if (typeof accountAttempt.n_attempt !== 'number') { // if n_attempt is undefined
                    throw new Error('Server Error');
                }

                if (accountAttempt.n_attempt >= 3) {
                    await accountModel.blockAccount(transfer.from_account_id);
                    throw new Error('ACCOUNT BLOCKED');
                }

                throw new Error('Wrong password'); // add modified Error class later
            }

            if (fromAccount.blocked) {
                throw new Error('ACCOUNT BLOCKED');
            }

            if (transfer.is_scheduled) {
                if (transfer.schedule_date === undefined) {
                    throw new Error('Scheduled transfers must have schedule_date')
                }
                transfer.status = "SCHEDULED";
            } else {
                transfer.status = "COMPLETED";
            }

            const newTransfer: TransferOut | null = await transferModel.create(transfer, {id: true, value: true});

            if (!newTransfer?.value) {
                throw new Error('Transfer not found');
            }
            
            if (transfer.is_scheduled) {
                return {};
            } else {
                const fromAccountNewBalance = Number(fromAccount.balance) - Number(transfer.value); 
                const toAccountNewBalance = Number(toAccount.balance) + Number(transfer.value); 

                const [fromBalanceUpdated, toBalanceUpdated] = await Promise.all([
                    accountModel.updateBalance(transfer.from_account_id, new Prisma.Decimal(fromAccountNewBalance)),
                    accountModel.updateBalance(transfer.to_account_id, new Prisma.Decimal(toAccountNewBalance))
                ]);

                const notificationFromUser: NotificationIn = MapTo.NotificationIn({
                    transfer_id: newTransfer.id,
                    user_id: toAccount.user_id,
                    text: `You recieved R$${newTransfer.value}`,
                });

                const notification: NotificationOut | null = await notificationModel.create(notificationFromUser);

                return {
                    from_account_old_balance: fromAccount.balance,
                    from_account_new_balance: fromBalanceUpdated,
                    to_account_old_balance: toAccount.balance,
                    to_account_new_balance: toBalanceUpdated,
                    notification_to_user: notification,
                };
            }
        } catch (e) {
            throw e;
        }
    }
}