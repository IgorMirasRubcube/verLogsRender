import { PrismaClient } from '@prisma/client';
import { TransferIn } from 'dtos/TransfersDTO';

const prisma = new PrismaClient();

export default class TransferModel {

  create = async (transfer: TransferIn) => {
    return await prisma.transfer.create({
      data: transfer,
      select: {
        id: true
      },
    })
  }

  getAll = async () => {
    return await prisma.transfer.findMany();
  }

  get = async (id: string, selectFields: Record<string, boolean> = {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      cpf: true,
      birth_date: true,
      password: true,
      n_attempt: true,
      is_admin: true,
      blocked: true,
      block_date: true,
      created_at: true,
      updated_at: true,
      address_id: true
    }) => {
    return await prisma.user.findFirst({
      where: { id: id },
      select: selectFields,
    });
  }

  delete = async (id: string) => {
    return await prisma.user.delete({
      where: {
        id
      }
    })
  }

  update = async (id: string, password: string) => {
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        password: password,
      }
    })
  }

  getAllByAccountId = async (account_id: string,
    periodStartDate: Date,
    periodEndDate: Date,
    sortType: string,
    selectFields: Record<string, boolean> = {
      id: true,
      from_account_id: true,
      to_account_id: true,
      value: true,
      description: true,
      type: true,
      is_scheduled: true,
      schedule_date: true,
      status: true,
      created_at: true,
      updated_at: true,
    }
  ) => {
    return await prisma.transfer.findMany({
      where: {
        OR: [
          {
            to_account_id: account_id,
          },
          {
            from_account_id: account_id
          },
        ],
        AND: {
          created_at: {
            gte: periodStartDate,
            lte: periodEndDate
          },
        },
      },
      orderBy: {
        created_at: sortType === 'older' ? 'asc' : 'desc',
      },
      select: selectFields
    })
  }

  getEntrancesByAccountId = async (account_id: string,
    periodStartDate: Date,
    periodEndDate: Date,
    sortType: string,
    selectFields: Record<string, boolean> = {
      id: true,
      from_account_id: true,
      to_account_id: true,
      value: true,
      description: true,
      type: true,
      is_scheduled: true,
      schedule_date: true,
      status: true,
      created_at: true,
      updated_at: true,
    }
  ) => {
    return await prisma.transfer.findMany({
      where: {
        to_account_id: account_id,
        AND: {
          created_at: {
            gte: periodStartDate,
            lte: periodEndDate
          },
        },
      },
      orderBy: {
        created_at: sortType === 'older' ? 'asc' : 'desc',
      },
      select: selectFields
    })
  }

  getExitsByAccountId = async (account_id: string,
    periodStartDate: Date,
    periodEndDate: Date,
    sortType: string,
    selectFields: Record<string, boolean> = {
      id: true,
      from_account_id: true,
      to_account_id: true,
      value: true,
      description: true,
      type: true,
      is_scheduled: true,
      schedule_date: true,
      status: true,
      created_at: true,
      updated_at: true,
    }
  ) => {
    return await prisma.transfer.findMany({
      where: {
        from_account_id: account_id,
        AND: {
          created_at: {
            gte: periodStartDate,
            lte: periodEndDate
          },
        },
      },
      orderBy: {
        created_at: sortType === 'older' ? 'asc' : 'desc',
      },
      select: selectFields
    })
  }

  getFuturesByAccountId = async (account_id: string,
    sortType: string,
    selectFields: Record<string, boolean> = {
      id: true,
      from_account_id: true,
      to_account_id: true,
      value: true,
      description: true,
      type: true,
      is_scheduled: true,
      schedule_date: true,
      status: true,
      created_at: true,
      updated_at: true,
    }
  ) => {
    return await prisma.transfer.findMany({
      where: {
        AND: [
          {
            to_account_id: account_id,
          },
          {
            is_scheduled: true,
          },
          {
            schedule_date: {
              gte: new Date(),
            },
          },
        ],
      },
      orderBy: {
        created_at: sortType === 'older' ? 'asc' : 'desc',
      },
      select: selectFields
    })
  }
};