import { PrismaClient } from '@prisma/client';
import { UserIn } from 'dtos/UsersDTO';

const prisma = new PrismaClient();

export default class UserModel {

  create = async (user: UserIn) => {
    return await prisma.user.create({
      data: user,
      select: {
        id: true,
        role: true
      },
    })
  }

  getAll = async () => {
    return await prisma.user.findMany();
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

  updatePassword = async (id: string, password: string) => {
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        password: password,
      }
    })
  }

  updatePasswordReset = async (id: string,
    passwordResetToken: string,
    passwordResetExpires: Date,
    ) => {
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        password_reset_token: passwordResetToken,
        password_reset_expires: passwordResetExpires,
      }
    })
  }

  findByEmail = async (email: string) => {
    return await prisma.user.findUnique({
      where: { email: email }
    })
  }

  findByCPF = async (cpf: string, selectFields: Record<string, boolean> = { 
    id: true,
    cpf: true,
    password: true,
    full_name: true,
    n_attempt: true,
    blocked: true,
    email: true,
    password_reset_token: true,
    password_reset_expires: true,
    role: true,
  }) => {
    return await prisma.user.findUnique({
      where: { cpf: cpf },
      select: selectFields,
    });
  }

  incrementAttempt = async (id: string, selectFields: Record<string, boolean> = {
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
    return await prisma.user.update({
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

  blockUser = async (id: string, selectFields: Record<string, boolean> = {
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
    return await prisma.user.update({
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

  resetAttempt = async (id: string, selectFields: Record<string, boolean> = {
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
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        n_attempt: 0,
      },
      select: selectFields,
    });
  }

  resetAttemptMany = async (selectFields: Record<string, boolean> = {
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
    return await prisma.user.updateMany({
      where: {
        blocked: false,
      },
      data: {
        n_attempt: 0,
      },
    });
  }

  unblockUser = async (id: string, selectFields: Record<string, boolean> = {
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
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        blocked: false,
        n_attempt: 0,
      },
      select: selectFields,
    });
  }
};