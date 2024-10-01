import { prismaClient } from "../index";

export class Class {
  static async findById(id: string) {
    return prismaClient.class.findUnique({ where: { id } });
  }

  static async findByClassCode(classCode: string) {
    return prismaClient.class.findUnique({ where: { classCode } });
  }

  static async create(data: {
    classCode: string;
    className: string;
    thumbnail: string;
    isPublished?: boolean;
    majorId?: string;
    teacherId?: string;
  }) {
    return prismaClient.class.create({ data });
  }

  static async update(
    id: string,
    data: Partial<{
      classCode: string;
      className: string;
      thumbnail: string;
      isPublished: boolean;
      majorId?: string;
      teacherId?: string;
    }>
  ) {
    return prismaClient.class.update({ where: { id }, data });
  }
}
