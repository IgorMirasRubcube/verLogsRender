import { PrismaClient } from '@prisma/client';
import { AccountIn } from 'dtos/AccountsDTO';

const prisma = new PrismaClient();

export default class AccountModel {

  create = async (account: AccountIn) => {
    return await prisma.account.create({
      data: account
    });
  }

  getAll = async () => {
    return await prisma.account.findMany();
  }

  get = async (id: string) => {
    return await prisma.account.findUnique({
      where: {
        id
      }
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