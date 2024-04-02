import { PrismaClient } from '@prisma/client';
import { UserIn } from 'dtos/UsersDTO';

const prisma = new PrismaClient();

export default class UserModel {

  create = async (user: UserIn) => {
    return await prisma.user.create({
      data: user,
      select: {
        id: true
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
    return await prisma.user.findUnique({
      where: { id },
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

  findByEmail = async (email: string) => {
    return await prisma.user.findUnique({
      where: { email: email }
    })
  }

  findByCPF = async (cpf: string, selectFields: Record<string, boolean> = { id: true, cpf: true, password: true }) => {
    return await prisma.user.findUnique({
      where: { cpf: cpf },
      select: selectFields,
    });
  }
};