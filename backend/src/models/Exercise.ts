import { prismaClient } from "../index";

export class Exercise {
  static async findById(id: string) {
    return prismaClient.exercise.findUnique({ where: { id } });
  }

  static async findByLessonId(lessonId: string) {
    return prismaClient.exercise.findUnique({ where: { lessonId } });
  }

  static async create(data: {
    name: string;
    url: string;
    lessonId: string;
    userId?: string;
  }) {
    return prismaClient.exercise.create({ data });
  }

  static async update(
    id: string,
    data: Partial<{ name: string; url: string; userId?: string }>
  ) {
    return prismaClient.exercise.update({ where: { id }, data });
  }
}
