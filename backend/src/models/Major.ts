import { prismaClient } from "../index";

export class Major {
  static async findById(id: string) {
    return prismaClient.major.findUnique({ where: { id } });
  }

  static async findByName(name: string) {
    return prismaClient.major.findUnique({ where: { name } });
  }

  static async create(data: { name: string }) {
    return prismaClient.major.create({ data });
  }

  static async update(id: string, data: { name: string }) {
    return prismaClient.major.update({ where: { id }, data });
  }
}
