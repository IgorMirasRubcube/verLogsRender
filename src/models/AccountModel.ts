import { Prisma, PrismaClient } from '@prisma/client';
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

  me = async (user_id: string,
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
        user_id: user_id,
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

  update = async (id: string, transfer_password: string) => {
    return await prisma.account.update({
      where: {
        id
      },
      data: {
        transfer_password: transfer_password,
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
          account_number: account_number,
          blocked: false,
        },
        select: selectFields,
      });
    }

    updateBalance = async (id: string, balance: Prisma.Decimal) => {
      return await prisma.account.update({
        where: {
          id
        },
        data: {
          balance: balance,
        },
        select: { balance: true}
      })
    }

    incrementAttempt = async (id: string, selectFields: Record<string, boolean> = {
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
   }) => {
      return await prisma.account.update({
        where: {
          id: id,
        },
        data: {
          n_attempt: {
            increment: 1,
          },
        },
        select: selectFields
      });
    }

    blockAccount = async (id: string, selectFields: Record<string, boolean> = {
      id: true,
      user_id: true,
      transfer_password: true,
      balance: true,
      bank: true,
      agency: true,
      account_number: true,
      n_attempt: true,
      blocked: true,
      block_date: true,
      created_at: true,
      updated_at: true 
   }) => {
      return await prisma.account.update({
        where: {
          id: id,
        },
        data: {
          blocked: true,
          block_date: new Date(),
        },
        select: selectFields
      });
    }
};