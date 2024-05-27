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

  getNumberOfUnviewed = async (user_id: string) => {
    return await prisma.notification.count({
      where: {
        user_id,
        viewed_flag: false,
      }
    });
  }

  getAllLoggedUser = async (user_id: string) => {
    return await prisma.notification.findMany({
      where: { user_id }
    });
  }
};