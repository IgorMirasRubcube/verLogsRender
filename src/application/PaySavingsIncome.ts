import { AccountOut } from "dtos/AccountsDTO";
import AccountModel from "models/AccountModel";
import { TransferIn, TransferOut } from "dtos/TransfersDTO";
import TransferModel from "models/TransferModel";
import { Prisma } from "@prisma/client";
import NotificationModel from "models/NotificationModel";
import { NotificationIn } from "dtos/NotificationsDTO";
import { MapTo } from "utils/mapToUtil";
import { formatNumberToShow } from "utils/numberUtil";

export default class PaySavingsIncome {
    constructor() {

    }

    async execute(): Promise<void> {
        const transferModel = new TransferModel();
        const accountModel = new AccountModel();
        const notificationModel = new NotificationModel();

        try {
            const savingAccounts: AccountOut[] | null = await accountModel.getSavings({
                balance: true, id: true,
            });

            for (const savingAccount of savingAccounts) {
                if (!savingAccount?.balance || !savingAccount?.id) {
                    console.log('passou aqui PaySavingsInocome (deu B.O.)')
                    return;
                }

                const calculatedValue = Number(savingAccount.balance) * 0.01;
                const calculatedValuePrismaDecimal = new Prisma.Decimal(calculatedValue);

                const income = MapTo.TransferIn({
                    from_account_id: "126bc9cc-4fb1-4ba8-bfb5-338ff39f6a16",    // account_id of RUBBANK S.A.
                    to_account_id: savingAccount.id,
                    value: calculatedValuePrismaDecimal,
                    description: '',
                    type: "TED",
                    is_scheduled: false,
                    status: "INCOME"
                });

                const paidIncome: TransferOut = await transferModel.create(income, { id: true });

                const notificationToUser: NotificationIn = MapTo.NotificationIn({
                    transfer_id: paidIncome.id,
                    account_id: savingAccount.id,
                    text: `Sua Conta Poupança rendeu RC${formatNumberToShow(calculatedValuePrismaDecimal.toString())} esse mês`
                });

                await notificationModel.create(notificationToUser);

                const newSavingBalance = Number(savingAccount.balance) + (Number(savingAccount.balance) * 0.01);
                const newSavingBalancePrismaDecimal = new Prisma.Decimal(newSavingBalance);

                fetch(`https://www.google-analytics.com/mp/collect?firebase_app_id=${process.env.FIREBASE_APP_ID}&api_secret=${process.env.FIREBASE_API_SECRET}`, {
                    method: "POST",
                    body: JSON.stringify({
                        app_instance_id: 'app_instance_id',
                        events: [{
                            name: 'savingBalance',
                            params: {
                                created_at: Date.now().toString(),
                                balance: formatNumberToShow(newSavingBalancePrismaDecimal.toString()),
                                account_id: savingAccount.id,
                            },
                        }]
                    })
                });
            }


        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}