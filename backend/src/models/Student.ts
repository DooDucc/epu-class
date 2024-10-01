import { prismaClient } from "../index";

export class Student {
  static async findById(id: string) {
    return prismaClient.student.findUnique({ where: { id } });
  }

  static async findByStudentCode(studentCode: string) {
    return prismaClient.student.findUnique({ where: { studentCode } });
  }

  static async create(data: {
    studentCode: string;
    password: string;
    userId?: string;
  }) {
    return prismaClient.student.create({ data });
  }
}
