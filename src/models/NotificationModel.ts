import { Prisma, PrismaClient } from '@prisma/client';
import { NotificationIn } from 'dtos/NotificationsDTO';

const prisma = new PrismaClient();

export default class NotificationModel {

  create = async (notification: NotificationIn) => {
    return await prisma.notification.create({
      data: notification
    });
  }

  getAll = async () => {
    return await prisma.notification.findMany();
  }

  get = async (id: number,
    selectFields: Record<string, boolean> = {
       id: true,
       transfer_id: true,
       user_id: true,
       text: true,
       is_favorite: true,
       viewed_flag: true,
       created_at: true,
       updated_at: true 
    })  => {
    return await prisma.notification.findUnique({
      where: { id },
      select: selectFields,
    });
  }

  me = async (id: string,
    selectFields: Record<string, boolean> = {
       id: true,
       user_id: true,
       transfer_password: true,
       balance: true,
       bank: true,
       agency: true,
       account_number: true,
       n_attemp: true,
       blocked: true,
       block_date: true,
       created_at: true,
       updated_at: true 
    })  => {
    return await prisma.account.findFirst({
      where: {
        user_id: id,
        type: "checking"
      },
      select: selectFields,
    });
  }

  delete = async (id: string) => {
    return await prisma.account.delete({
      where: {
        id
      }
    })
  }

  update = async (id: string, account: AccountIn) => {
    return await prisma.account.update({
      where: {
        id
      },
      data: {
        ...account
      }
    })
  }
};