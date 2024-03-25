import { PrismaClient } from '@prisma/client';
import { UserIn } from 'dtos/UsersDTO';

const prisma = new PrismaClient();

export default class UserModel {

  create = async (user: UserIn) => {
    return await prisma.user.create({
      data: user,
      select: {
        id: true,
        email: true,
        full_name: true,
      },
    })
  }

  getAll = async () => {
    return await prisma.user.findMany();
  }

  get = async (id: string) => {
    return await prisma.user.findUnique({
      where: {
        id
      }
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
};