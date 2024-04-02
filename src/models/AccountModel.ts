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

  get = async (id: string,
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
    return await prisma.account.findUnique({
      where: { id },
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

  getAllByUserId = async (userId: string,
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
      return await prisma.account.findMany({
        where: { user_id: userId },
        select: selectFields,
      });
    }

    getByAgencyAndNumber = async (agency: string,
      account_number: string,
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
          agency: agency,
          account_number: account_number
        },
        select: selectFields,
      });
    }
};