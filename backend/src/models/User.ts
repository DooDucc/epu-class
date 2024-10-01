import { prismaClient } from "../index";

export class User {
  static async findById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  static async create(data: {
    phone: string;
    fullName: string;
    avatar?: string;
    isActive?: boolean;
  }) {
    return prismaClient.user.create({ data });
  }

  static async update(
    id: string,
    data: Partial<{
      phone: string;
      fullName: string;
      avatar?: string;
      isActive: boolean;
    }>
  ) {
    return prismaClient.user.update({ where: { id }, data });
  }
}
