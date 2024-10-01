import { prismaClient } from "../index";

export class Teacher {
  static async findById(id: string) {
    return prismaClient.teacher.findUnique({ where: { id } });
  }

  static async findByEmail(email: string) {
    return prismaClient.teacher.findUnique({ where: { email } });
  }

  static async create(data: {
    email: string;
    password: string;
    userId?: string;
  }) {
    return prismaClient.teacher.create({ data });
  }
}
