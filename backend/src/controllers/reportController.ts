import { prismaClient } from "..";
import { Request, Response } from "express";
import {
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfQuarter,
  endOfYear,
} from "date-fns";

export async function getStudentsByYear(req: Request, res: Response) {
  try {
    const { classId, year } = req.params;

    // @ts-ignore
    const teacherId = req.user.id;

    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31);

    const classWithStudents = await prismaClient.class.findUnique({
      where: { id: classId, isPublished: true, teacherId },
      include: {
        students: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            createdAt: true,
          },
        },
      },
    });

    const monthlyStudentCounts = Array(12).fill(0);

    classWithStudents?.students.forEach((student) => {
      const month = student.createdAt.getMonth();
      monthlyStudentCounts[month]++;
    });

    const result = monthlyStudentCounts.map((count, index) => ({
      month: index + 1,
      studentCount: count,
    }));

    return res.json(result);
  } catch (error) {
    console.error("Error in getStudentsByTimePeriod:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getStudentsByCourseAndYear(req: Request, res: Response) {
  try {
    const { courseId, year } = req.params;

    // @ts-ignore
    const teacherId = req.user.id;

    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31);

    const courseWithStudents = await prismaClient.course.findUnique({
      where: {
        id: courseId,
        teacherId,
      },
      include: {
        students: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            createdAt: true,
          },
        },
      },
    });

    const monthlyStudentCounts = Array(12).fill(0);

    courseWithStudents?.students.forEach((student) => {
      const month = student.createdAt.getMonth();
      monthlyStudentCounts[month]++;
    });

    const result = monthlyStudentCounts.map((count, index) => ({
      month: index + 1,
      studentCount: count,
    }));

    return res.json(result);
  } catch (error) {
    console.error("Error in getStudentsByCourseAndTimePeriod:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSubmittedExerciseStats(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;

    const submittedExercises = await prismaClient.submittedExercise.findMany({
      where: { lessonId },
      select: { point: true },
    });

    const totalSubmissions = submittedExercises.length;
    let lowRange = 0;
    let midRange = 0;
    let highRange = 0;

    submittedExercises.forEach((exercise) => {
      const point = parseFloat(exercise.point || "0");
      if (point >= 0 && point < 5) {
        lowRange++;
      } else if (point >= 5 && point < 8) {
        midRange++;
      } else if (point >= 8 && point <= 10) {
        highRange++;
      }
    });

    const stats = {
      totalSubmissions,
      percentages: {
        lowRange: (lowRange / totalSubmissions) * 100,
        midRange: (midRange / totalSubmissions) * 100,
        highRange: (highRange / totalSubmissions) * 100,
      },
    };

    return res.json(stats);
  } catch (error) {
    console.error("Error in getSubmittedExerciseStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCourseExerciseStats(req: Request, res: Response) {
  try {
    const { courseId } = req.params;

    // Get all lessons for the course
    const lessons = await prismaClient.lesson.findMany({
      where: { courseId },
      select: { id: true },
    });

    const lessonIds = lessons.map((lesson) => lesson.id);

    // Get all submitted exercises for these lessons
    const submittedExercises = await prismaClient.submittedExercise.findMany({
      where: { lessonId: { in: lessonIds } },
      select: { point: true },
    });

    const totalSubmissions = submittedExercises.length;
    let lowRange = 0;
    let midRange = 0;
    let highRange = 0;

    submittedExercises.forEach((exercise) => {
      const point = parseFloat(exercise.point || "0");
      if (point >= 0 && point < 5) {
        lowRange++;
      } else if (point >= 5 && point < 8) {
        midRange++;
      } else if (point >= 8 && point <= 10) {
        highRange++;
      }
    });

    const stats = {
      totalSubmissions,
      percentages: {
        lowRange:
          totalSubmissions > 0 ? (lowRange / totalSubmissions) * 100 : 0,
        midRange:
          totalSubmissions > 0 ? (midRange / totalSubmissions) * 100 : 0,
        highRange:
          totalSubmissions > 0 ? (highRange / totalSubmissions) * 100 : 0,
      },
    };

    return res.json(stats);
  } catch (error) {
    console.error("Error in getCourseExerciseStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getClassExerciseStats(req: Request, res: Response) {
  try {
    const { classId } = req.params;

    // Get all courses for the class
    const courses = await prismaClient.course.findMany({
      where: { classId },
      select: { id: true },
    });

    const courseIds = courses.map((course) => course.id);

    // Get all lessons for these courses
    const lessons = await prismaClient.lesson.findMany({
      where: { courseId: { in: courseIds } },
      select: { id: true },
    });

    const lessonIds = lessons.map((lesson) => lesson.id);

    // Get all submitted exercises for these lessons
    const submittedExercises = await prismaClient.submittedExercise.findMany({
      where: { lessonId: { in: lessonIds } },
      select: { point: true },
    });

    const totalSubmissions = submittedExercises.length;
    let lowRange = 0;
    let midRange = 0;
    let highRange = 0;

    submittedExercises.forEach((exercise) => {
      const point = parseFloat(exercise.point || "0");
      if (point >= 0 && point < 5) {
        lowRange++;
      } else if (point >= 5 && point < 8) {
        midRange++;
      } else if (point >= 8 && point <= 10) {
        highRange++;
      }
    });

    const stats = {
      totalSubmissions,
      percentages: {
        lowRange:
          totalSubmissions > 0 ? (lowRange / totalSubmissions) * 100 : 0,
        midRange:
          totalSubmissions > 0 ? (midRange / totalSubmissions) * 100 : 0,
        highRange:
          totalSubmissions > 0 ? (highRange / totalSubmissions) * 100 : 0,
      },
    };

    return res.json(stats);
  } catch (error) {
    console.error("Error in getClassExerciseStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSubmittedExercisesWithStudentInfo(
  req: Request,
  res: Response
) {
  try {
    const { lessonId } = req.params;

    const submittedExercises = await prismaClient.submittedExercise.findMany({
      where: { lessonId },
      select: {
        id: true,
        point: true,
        studentId: true,
      },
    });

    const sortedExercises = submittedExercises
      .sort((a, b) => parseFloat(b.point || "0") - parseFloat(a.point || "0"))
      .slice(0, 10);

    const formattedResults = await Promise.all(
      sortedExercises.map(async (submission) => {
        const student = await prismaClient.student.findUnique({
          where: { id: submission.studentId },
          select: {
            id: true,
            studentCode: true,
            user: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        });

        return {
          id: submission.id,
          point: submission.point,
          student: {
            id: student?.id,
            studentCode: student?.studentCode,
            fullName: student?.user?.fullName || null,
            avatar: student?.user?.avatar || null,
          },
        };
      })
    );

    return res.json(formattedResults);
  } catch (error) {
    console.error("Error in getSubmittedExercisesWithStudentInfo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
