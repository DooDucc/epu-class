import { prismaClient } from "../index";

export class Attachment {
  static async findById(id: string) {
    return prismaClient.attachment.findUnique({ where: { id } });
  }

  static async create(data: { name: string; url: string; lessonId: string }) {
    return prismaClient.attachment.create({ data });
  }

  static async update(
    id: string,
    data: Partial<{ name: string; url: string }>
  ) {
    return prismaClient.attachment.update({ where: { id }, data });
  }

  static async findByLessonId(lessonId: string) {
    return prismaClient.attachment.findMany({ where: { lessonId } });
  }
}
