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
  
  getNumberOfUnviewed = async (account_id: string) => {
    return await prisma.notification.count({
      where: {
        account_id,
        viewed_flag: false,
      }
    });
  }

  getAllLoggedUser = async (account_id: string,
    skip: any,
    take: any,
    selectFields: Record<string, boolean> = {
      id: true,
      transfer_id: true,
      user_id: true,
      text: true,
      is_favorite: true,
      viewed_flag: true,
      created_at: true,
      updated_at: true 
   }
  ) => {
    return await prisma.notification.findMany({
      where: { account_id },
      select: selectFields,
      skip: Number(skip),
      take: Number(take),
    });
  }
};