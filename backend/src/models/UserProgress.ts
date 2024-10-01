import { prismaClient } from "../index";

export class UserProgress {
  static async findById(id: string) {
    return prismaClient.userProgress.findUnique({ where: { id } });
  }

  static async findByStudentAndLesson(studentId: string, lessonId: string) {
    return prismaClient.userProgress.findUnique({
      where: { studentId_lessonId: { studentId, lessonId } },
    });
  }

  static async create(data: {
    isCompleted?: boolean;
    lessonId: string;
    studentId?: string;
  }) {
    return prismaClient.userProgress.create({ data });
  }

  static async update(id: string, data: { isCompleted: boolean }) {
    return prismaClient.userProgress.update({ where: { id }, data });
  }
}
