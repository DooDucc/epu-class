import { prismaClient } from "../index";

export class Lesson {
  static async findById(id: string) {
    return prismaClient.lesson.findUnique({ where: { id } });
  }

  static async create(data: {
    title: string;
    desc?: string;
    position: number;
    isPublished?: boolean;
    videoUrl?: string;
    courseId: string;
  }) {
    return prismaClient.lesson.create({ data });
  }

  static async update(
    id: string,
    data: Partial<{
      title: string;
      desc?: string;
      position: number;
      isPublished: boolean;
      videoUrl?: string;
      courseId: string;
    }>
  ) {
    return prismaClient.lesson.update({ where: { id }, data });
  }
}
