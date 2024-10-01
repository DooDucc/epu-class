import { prismaClient } from "../index";

export class Note {
  static async findById(id: string) {
    return prismaClient.note.findUnique({ where: { id } });
  }

  static async findByLessonId(lessonId: string) {
    return prismaClient.note.findUnique({ where: { lessonId } });
  }

  static async create(data: { content: string; lessonId: string }) {
    return prismaClient.note.create({ data });
  }

  static async update(id: string, data: { content: string }) {
    return prismaClient.note.update({ where: { id }, data });
  }
}
