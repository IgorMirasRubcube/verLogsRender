import { AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { TransferIn, TransferOut } from "dtos/TransfersDTO";
import TransferModel from "models/TransferModel";
import { Prisma } from "@prisma/client";
import NotificationModel from "models/NotificationModel";
import { NotificationIn } from "dtos/NotificationsDTO";
import { MapTo } from "utils/mapToUtil";

export default class PayScheduledTransfers {
    constructor () {

    }

    async execute(): Promise<void> {
        const transferModel = new TransferModel();
        const accountModel = new AccountModel();
        const notificationModel = new NotificationModel();
        
        try {
            const scheduledTransfers: TransferOut[] = await transferModel.getScheduledTransfersForPayment(
                {id: true, from_account_id: true, to_account_id: true, value: true, schedule_date: true}
            ) as TransferOut[];
            
            for (const transfer of scheduledTransfers) {
                if (!transfer?.from_account_id || !transfer?.to_account_id) {
                    return;
                }
                
                const fromAccount: AccountOut = await accountModel.get(
                    transfer.from_account_id,
                    {user_id: true, balance: true}
                ) as AccountOut;

                const toAccount: AccountOut = await accountModel.get(
                    transfer.to_account_id,
                    {user_id: true, balance: true}
                ) as AccountOut;
                
                if (!transfer?.id) { return; }

                if (fromAccount.balance && (Number(fromAccount.balance) < Number(transfer.value))) {
                    await transferModel.updateStatus(transfer.id, "FAILED");
                    
                    const notificationFromUser: NotificationIn = MapTo.NotificationIn({
                        transfer_id: transfer.id,
                        user_id: fromAccount.user_id,
                        text: `Transfer Scheduled to ${transfer.schedule_date} in value of R$${transfer.value} FAILED (Not enough balance)`  
                    });
                    await notificationModel.create(notificationFromUser);
                } else {
                    const fromAccountNewBalance = Number(fromAccount.balance) - Number(transfer.value); 
                    const toAccountNewBalance = Number(toAccount.balance) + Number(transfer.value); 

                    const [fromBalanceUpdated, toBalanceUpdated] = await Promise.all([
                        accountModel.updateBalance(transfer.from_account_id, new Prisma.Decimal(fromAccountNewBalance)),
                        accountModel.updateBalance(transfer.to_account_id, new Prisma.Decimal(toAccountNewBalance))
                    ]);

                    await transferModel.updateStatus(transfer.id, "COMPLETED");

                    const notificationFromUser: NotificationIn = MapTo.NotificationIn({
                        transfer_id: transfer.id,
                        user_id: fromAccount.user_id,
                        text: `Transfer Scheduled to ${transfer.schedule_date} in value of R$${transfer.value} COMPLETED`  
                    });

                    const notificationToUser: NotificationIn = MapTo.NotificationIn({
                        transfer_id: transfer.id,
                        user_id: toAccount.user_id,
                        text: `You recieved R$${transfer.value}`  
                    });

                    await Promise.all([
                        notificationModel.create(notificationFromUser),
                        notificationModel.create(notificationToUser)
                    ]);
                }
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}