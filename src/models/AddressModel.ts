import { PrismaClient } from '@prisma/client';
import { AddressIn } from 'dtos/AddressesDTO';

const prisma = new PrismaClient();

export default class AddressModel {

  create = async (address: AddressIn) => {
    return await prisma.address.create({
      data: address,
      select: {
        id: true,
      }
    });
  }

  getAll = async () => {
    return await prisma.address.findMany();
  }

  get = async (id: number) => {
    return await prisma.address.findUnique({
      where: {
        id
      }
    });
  }

  delete = async (id: number) => {
    return await prisma.address.delete({
      where: {
        id
      }
    })
  }

  update = async (id: number, address: AddressIn) => {
    return await prisma.address.update({
      where: {
        id
      },
      data: {
        ...address,
        updated_at: new Date(),
      }
    })
  }
};