import { PrismaClient, TransferStatus } from '@prisma/client';
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
  }) => {
    return await prisma.transfer.findFirst({
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

  updateStatus = async (id: string, status: TransferStatus) => {
    return await prisma.transfer.update({
      where: {
        id
      },
      data: {
        status: status
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
          status: "COMPLETED" || "FAILED" || "SCHEDULED",
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
          status: "COMPLETED" || "FAILED" || "SCHEDULED",
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
          status: "COMPLETED" || "FAILED" || "SCHEDULED",
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
    periodEndDate: Date,
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
            from_account_id: account_id,
          },
          {
            is_scheduled: true,
          },
          {
            schedule_date: {
              gte: new Date(),
              lte: periodEndDate,
            },
          },
          {
            status: "SCHEDULED",
          },
        ],
      },
      orderBy: {
        created_at: sortType === 'older' ? 'asc' : 'desc',
      },
      select: selectFields
    })
  }

  getScheduledTransfersForPayment = async (
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
            is_scheduled: true,
          },
          {
            status: "SCHEDULED",
          },
          {
            schedule_date: {
              lte: new Date(),
            },
          },
        ],
      },
      select: selectFields
    })
  }
};