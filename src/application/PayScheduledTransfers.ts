import { AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { TransferIn, TransferOut } from "dtos/TransfersDTO";
import TransferModel from "models/TransferModel";
import { Prisma } from "@prisma/client";
import NotificationModel from "models/NotificationModel";
import { NotificationIn } from "dtos/NotificationsDTO";
import { MapTo } from "utils/mapToUtil";
import { formatNumberToSend } from "utils/numberUtil";
import { formatDateToBrazilianPortuguese } from "utils/dateUtil";

export default class PayScheduledTransfers {
    constructor() {

    }

    async execute(): Promise<void> {
        const transferModel = new TransferModel();
        const accountModel = new AccountModel();
        const notificationModel = new NotificationModel();

        try {
            const scheduledTransfers: TransferOut[] = await transferModel.getScheduledTransfersForPayment(
                { id: true, from_account_id: true, to_account_id: true, value: true, schedule_date: true }
            ) as TransferOut[];

            for (const transfer of scheduledTransfers) {
                if (!transfer?.from_account_id || !transfer?.to_account_id || !transfer?.schedule_date) {
                    return;
                }

                const fromAccount: AccountOut = await accountModel.get(
                    transfer.from_account_id,
                    { user_id: true, balance: true, id: true }
                ) as AccountOut;

                const toAccount: AccountOut = await accountModel.get(
                    transfer.to_account_id,
                    { user_id: true, balance: true, id: true }
                ) as AccountOut;

                if (!transfer?.id || !transfer?.value) { return; }

                if (fromAccount.balance && (Number(fromAccount.balance) < Number(transfer.value))) {
                    await transferModel.updateStatus(transfer.id, "FAILED");

                    const notificationFromUser: NotificationIn = MapTo.NotificationIn({
                        transfer_id: transfer.id,
                        account_id: fromAccount.id,
                        text: `A transferência agendada para ${transfer.schedule_date} no valor de RC${formatNumberToSend(transfer.value.toString())} FALHOU (saldo insuficiente)`
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
                        account_id: fromAccount.id,
                        text: `A transferência agendada para ${formatDateToBrazilianPortuguese(transfer.schedule_date)} no valor de RC${formatNumberToSend(transfer.value.toString())} foi efetuada`
                    });

                    const notificationToUser: NotificationIn = MapTo.NotificationIn({
                        transfer_id: transfer.id,
                        account_id: toAccount.id,
                        text: `Você recebeu RC${formatNumberToSend(transfer.value.toString())}`
                    });

                    await Promise.all([
                        notificationModel.create(notificationFromUser),
                        notificationModel.create(notificationToUser)
                    ]);

                    fetch(`https://www.google-analytics.com/mp/collect?firebase_app_id=${process.env.FIREBASE_APP_ID}&api_secret=${process.env.FIREBASE_API_SECRET}`, {
                        method: "POST",
                        body: JSON.stringify({
                            app_instance_id: 'app_instance_id',
                            events: [{
                                name: 'transfer',
                                params: {
                                    created_at: Date.now().toString(),
                                    status: "SCHEDULED",
                                    value: formatNumberToSend(transfer.value.toString()),
                                },
                            }]
                        })
                    });

                }
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}