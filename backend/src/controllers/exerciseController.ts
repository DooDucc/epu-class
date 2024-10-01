import { Request, Response } from "express";
import { prismaClient } from "..";

export const getSubmittedExercises = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const teacherId = req.user.id;

    let submittedExercises = await prismaClient.submittedExercise.findMany({
      where: {
        teacherId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const studentIds = [
      ...new Set(submittedExercises.map((ex) => ex.studentId)),
    ];

    // Fetch user information for all students in one query
    const studentUsers = await prismaClient.student.findMany({
      where: {
        id: {
          in: studentIds,
        },
      },
      select: {
        id: true,
        user: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    // Create a map for quick lookup
    const studentUserMap = new Map(studentUsers.map((su) => [su.id, su.user]));

    // Append user information to each submitted exercise
    submittedExercises = submittedExercises.map((exercise) => ({
      ...exercise,
      studentFullName: studentUserMap.get(exercise.studentId)?.fullName ?? null,
      studentAvatar: studentUserMap.get(exercise.studentId)?.avatar ?? null,
    }));

    // Get unique lessonIds from submittedExercises
    const lessonIds = [
      ...new Set(submittedExercises.map((exercise) => exercise.lessonId)),
    ];

    // Fetch lessons separately
    const lessons = await prismaClient.lesson.findMany({
      where: {
        id: {
          in: lessonIds,
        },
      },
      select: {
        id: true,
        title: true,
        courseId: true,
      },
    });

    // Get unique courseIds from lessons
    const courseIds = [...new Set(lessons.map((lesson) => lesson.courseId))];

    // Fetch courses separately
    const courses = await prismaClient.course.findMany({
      where: {
        id: {
          in: courseIds,
        },
      },
      select: {
        id: true,
        title: true,
        classId: true,
      },
    });

    // Get unique classIds from courses
    const classIds = [...new Set(courses.map((course) => course.classId))];

    // Fetch classes separately
    const classes = await prismaClient.class.findMany({
      where: {
        id: {
          in: classIds.filter(Boolean) as string[],
        },
      },
      select: {
        id: true,
        className: true,
      },
    });

    // Combine courses with class information
    const coursesWithClasses = courses.map((course) => ({
      ...course,
      class: classes.find((cls) => cls.id === course.classId),
    }));

    // Combine lessons with course and class information
    const lessonsWithCoursesAndClasses = lessons.map((lesson) => ({
      ...lesson,
      course: coursesWithClasses.find(
        (course) => course.id === lesson.courseId
      ),
    }));

    // Combine submittedExercises with lesson, course, and class information
    const exercisesWithLessonsCoursesAndClasses = submittedExercises.map(
      (exercise) => ({
        ...exercise,
        lesson: lessonsWithCoursesAndClasses.find(
          (lesson) => lesson.id === exercise.lessonId
        ),
      })
    );

    return res.status(200).json(exercisesWithLessonsCoursesAndClasses);
  } catch (error) {
    console.error("Error fetching submitted exercises:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubmittedExerciseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const teacherId = req.user.id;

    const submittedExercise = await prismaClient.submittedExercise.findUnique({
      where: {
        id,
        teacherId,
      },
    });

    if (!submittedExercise) {
      return res.status(404).json({ error: "Submitted exercise not found" });
    }

    const studentUser = await prismaClient.student.findUnique({
      where: {
        id: submittedExercise.studentId,
      },
      select: {
        id: true,
        user: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    const submittedExerciseWithStudentUser = {
      ...submittedExercise,
      studentFullName: studentUser?.user?.fullName,
      studentAvatar: studentUser?.user?.avatar,
    };

    return res.status(200).json(submittedExerciseWithStudentUser);
  } catch (error) {
    console.error("Error fetching submitted exercise by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { exercises, comment, point } = req.body;
    // @ts-ignore
    const teacherId = req.user.id;

    const updatedExercise = await prismaClient.submittedExercise.update({
      where: {
        id,
        teacherId,
      },
      data: {
        exercises,
        comment,
        point,
      },
    });

    if (!updatedExercise) {
      return res.status(404).json({ error: "Submitted exercise not found" });
    }

    return res.status(200).json(updatedExercise);
  } catch (error) {
    console.error("Error updating submitted exercise:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
