import { prismaClient } from "..";
import { Request, Response } from "express";

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

export async function getStudentsByLessonAndYear(req: Request, res: Response) {
  try {
    const { lessonId, year } = req.params;

    // @ts-ignore
    const teacherId = req.user.id;

    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31);

    const lessonWithStudents = await prismaClient.lesson.findUnique({
      where: {
        id: lessonId,
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

    lessonWithStudents?.students.forEach((student) => {
      const month = student.createdAt.getMonth();
      monthlyStudentCounts[month]++;
    });

    const result = monthlyStudentCounts.map((count, index) => ({
      month: index + 1,
      studentCount: count,
    }));

    return res.json(result);
  } catch (error) {
    console.error("Error in getStudentsByLessonAndTimePeriod:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getLessonExerciseStats(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;

    // @ts-ignore
    const teacherId = req.user.id;

    // Get all lessons
    const lessons = await prismaClient.lesson.findMany({
      where: { id: lessonId, teacherId, isPublished: true },
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

    // @ts-ignore
    const teacherId = req.user.id;

    // Get all lessons
    const lessons = await prismaClient.lesson.findMany({
      where: { classId, teacherId, isPublished: true },
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

export async function getTotalInfo(req: Request, res: Response) {
  try {
    // @ts-ignore
    const teacherId = req.user.id;

    const [classCount, lessonCount, studentCount] = await Promise.all([
      prismaClient.class.count({
        where: { teacherId, isPublished: true },
      }),

      prismaClient.lesson.count({
        where: { teacherId, isPublished: true },
      }),
      prismaClient.student.count({
        where: {
          classes: {
            some: {
              teacherId,
              isPublished: true,
            },
          },
        },
      }),
    ]);

    const totalInfo = {
      classCount,
      lessonCount,
      studentCount,
    };

    return res.json(totalInfo);
  } catch (error) {
    console.error("Error in getTotalInfo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTopStudentsByClass(req: Request, res: Response) {
  try {
    const { classId } = req.params;

    // @ts-ignore
    const teacherId = req.user.id;

    // Get all lessons for the class
    const lessons = await prismaClient.lesson.findMany({
      where: { classId, teacherId, isPublished: true },
      select: { id: true },
    });

    const lessonIds = lessons.map((lesson) => lesson.id);

    // Get all submitted exercises for these lessons
    const submittedExercises = await prismaClient.submittedExercise.findMany({
      where: { lessonId: { in: lessonIds } },
      select: {
        studentId: true,
        point: true,
      },
    });

    // Calculate average point for each student
    const studentPoints = submittedExercises.reduce((acc, exercise) => {
      const point = parseFloat(exercise.point || "0");
      if (!acc[exercise.studentId]) {
        acc[exercise.studentId] = { total: 0, count: 0 };
      }
      acc[exercise.studentId].total += point;
      acc[exercise.studentId].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    // Calculate percentage and create sorted array
    const studentPercentages = Object.entries(studentPoints)
      .map(([studentId, { total, count }]) => ({
        studentId,
        count,
        percentage: (total / (count * 10)) * 10, // Assuming max point is 10
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    // Get student details for the top 10
    const topStudents = await prismaClient.student.findMany({
      where: {
        id: { in: studentPercentages.map((s) => s.studentId) },
      },
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

    // Combine student details with percentages
    const result = topStudents
      .map((student) => {
        const percentageInfo = studentPercentages.find(
          (s) => s.studentId === student.id
        );
        return {
          id: student.id,
          studentCode: student.studentCode,
          fullName: student.user?.fullName,
          avatar: student.user?.avatar,
          percentage: percentageInfo
            ? Number(percentageInfo.percentage.toFixed(2))
            : 0,
          count: percentageInfo ? percentageInfo.count : 0,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    return res.json(result);
  } catch (error) {
    console.error("Error in getTopStudentsByClass:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
