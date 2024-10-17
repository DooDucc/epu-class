import { Request, Response } from "express";
import { prismaClient } from "..";

export const getLessons = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where = {
      // @ts-ignore
      teacherId: req.user.id,
      ...(search
        ? {
            OR: [
              { title: { contains: search as string } },
              { desc: { contains: search as string } },
              { class: { id: { contains: search as string } } },
              { id: { contains: search as string } },
            ],
          }
        : {}),
    };

    const [lessons, totalCount] = await Promise.all([
      prismaClient.lesson.findMany({
        where,
        include: {
          userProgress: true,
          attachments: true,
          exercises: true,
        },
        skip,
        take: limitNumber,
      }),
      prismaClient.lesson.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.status(200).json({
      lessons,
      currentPage: pageNumber,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
};

export const getLessonsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const lessons = await prismaClient.lesson.findMany({
      where: {
        classId,
      },
      include: {
        userProgress: true,
        attachments: true,
        exercises: true,
      },
      orderBy: {
        position: "asc",
      },
    });

    res.status(200).json({
      lessons,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    const {
      title,
      desc,
      isPublished,
      videoUrl,
      videoDuration,
      classId,
      exercises,
      attachments,
    } = req.body;

    if (!title || !classId) {
      return res
        .status(400)
        .json({ error: "Title and Course ID are required" });
    }

    // Get all lessons with the same classId
    const existingLessons = await prismaClient.lesson.findMany({
      where: { classId },
      orderBy: { position: "desc" },
    });

    // Calculate the new position
    const newPosition =
      existingLessons.length > 0 ? existingLessons[0].position + 1 : 0;

    const newLesson = await prismaClient.lesson.create({
      data: {
        title,
        desc,
        position: newPosition,
        isPublished,
        videoUrl,
        videoDuration,
        classId,
        // @ts-ignore
        teacherId: req.user.id,
        exercises: {
          create: exercises
            ? exercises.map(
                (exercise: { url: string; name: string }, index: number) => ({
                  name: exercise.name,
                  url: exercise.url,
                })
              )
            : [],
        },
        attachments: {
          create: attachments
            ? attachments.map(
                (attachment: { url: string; name: string }, index: number) => ({
                  name: attachment.name,
                  url: attachment.url,
                })
              )
            : [],
        },
      },
      include: {
        exercises: true,
        attachments: true,
      },
    });

    res.status(201).json(newLesson);
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ error: "Failed to create lesson" });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      desc,
      position,
      isPublished,
      videoUrl,
      videoDuration,
      classId,
      exercises,
      attachments,
    } = req.body;

    // @ts-ignore
    const teacherId = req.user.id;

    if (!id) {
      return res.status(400).json({ error: "Lesson ID is required" });
    }

    const updatedLesson = await prismaClient.lesson.update({
      where: { id },
      data: {
        title,
        desc,
        position,
        isPublished,
        videoUrl,
        videoDuration,
        classId,
        // @ts-ignore
        teacherId,
        // Delete existing exercises and create new ones
        exercises: {
          deleteMany: {},
          create: exercises
            ? exercises.map(
                (exercise: { url: string; name: string }, index: number) => ({
                  name: exercise.name,
                  url: exercise.url,
                })
              )
            : [],
        },
        // Delete existing attachments and create new ones
        attachments: {
          deleteMany: {},
          create: attachments
            ? attachments.map(
                (attachment: { url: string; name: string }, index: number) => ({
                  name: attachment.name,
                  url: attachment.url,
                })
              )
            : [],
        },
      },
      include: {
        exercises: true,
        attachments: true,
      },
    });

    res.status(200).json(updatedLesson);
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ error: "Failed to update lesson" });
  }
};

export const getLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Lesson ID is required" });
    }

    const lesson = await prismaClient.lesson.findUnique({
      where: {
        id,
        // @ts-ignore
        teacherId: req.user.id,
      },
      include: {
        userProgress: true,
        attachments: true,
        exercises: true,
      },
    });

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Lesson ID is required" });
    }

    // Delete the lesson and all related data
    await prismaClient.lesson.delete({
      where: {
        id,
        // @ts-ignore
        teacherId: req.user.id,
      },
      // The onDelete: Cascade in the schema will automatically delete related data
    });

    res
      .status(200)
      .json({ message: "Lesson and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ error: "Failed to delete lesson" });
  }
};

export const updateLessonPositions = async (req: Request, res: Response) => {
  try {
    const { courseId, lessons } = req.body;

    if (!courseId || !Array.isArray(lessons) || lessons.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    for (let lesson of lessons) {
      await prismaClient.lesson.update({
        where: {
          id: lesson.id,
          // @ts-ignore
          teacherId: req.user.id,
        },
        data: { position: lesson.position },
      });
    }

    res.status(200).json({ message: "Lesson positions updated successfully" });
  } catch (error) {
    console.error("Error updating lesson positions:", error);
    res.status(500).json({ error: "Failed to update lesson positions" });
  }
};

export const updateLessonProgress = async (req: Request, res: Response) => {
  try {
    const { lessonId, studentId, isCompleted } = req.body;

    if (!lessonId || !studentId) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const userProgress = await prismaClient.userProgress.upsert({
      where: {
        studentId_lessonId: {
          lessonId,
          studentId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        lessonId,
        studentId,
        isCompleted,
      },
    });

    res.status(200).json(userProgress);
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    res.status(500).json({ error: "Failed to update lesson progress" });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const { lessonId, studentId, content } = req.body;

    if (!lessonId || !studentId || !content) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const updatedNote = await prismaClient.note.upsert({
      where: {
        lessonId_studentId: {
          lessonId,
          studentId,
        },
      },
      update: {
        content,
      },
      create: {
        lessonId,
        studentId,
        content,
      },
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
};

export const getNote = async (req: Request, res: Response) => {
  try {
    const { lessonId, studentId } = req.params;

    if (!lessonId || !studentId) {
      return res
        .status(400)
        .json({ error: "Lesson ID and Student ID are required" });
    }

    const note = await prismaClient.note.findUnique({
      where: {
        lessonId_studentId: {
          lessonId,
          studentId,
        },
      },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

export const getSubmittedExercise = async (req: Request, res: Response) => {
  try {
    const { lessonId, studentId } = req.params;

    if (!lessonId || !studentId) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const submittedExercise = await prismaClient.submittedExercise.findUnique({
      where: {
        lessonId_studentId: {
          lessonId,
          studentId,
        },
      },
    });

    if (!submittedExercise) {
      return res.status(404).json({ error: "Submitted exercise not found" });
    }

    res.status(200).json(submittedExercise);
  } catch (error) {
    console.error("Error fetching submitted exercise:", error);
    res.status(500).json({ error: "Failed to fetch submitted exercise" });
  }
};

export const submitExercise = async (req: Request, res: Response) => {
  try {
    const { lessonId, studentId, exercises, teacherId } = req.body;

    if (!lessonId || !studentId || !exercises || !teacherId) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const submittedExercise = await prismaClient.submittedExercise.create({
      data: {
        lessonId,
        studentId,
        exercises: JSON.stringify(exercises),
        teacherId,
      },
    });

    res.status(200).json(submittedExercise);
  } catch (error) {
    console.error("Error submitting exercise:", error);
    res.status(500).json({ error: "Failed to submit exercise" });
  }
};

export const getStudentLessons = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const studentId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const student = await prismaClient.student.findUnique({
      where: { id: studentId },
      include: {
        classes: {
          include: {
            lessons: {
              include: {
                userProgress: {
                  where: { studentId },
                },
                class: true,
              },
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const allLessons = student.classes.flatMap((item) => item.lessons);
    const totalCount = allLessons.length;
    const lessons = allLessons.slice(skip, skip + limitNumber);

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.status(200).json({
      lessons,
      currentPage: pageNumber,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching student lessons:", error);
    res.status(500).json({ error: "Failed to fetch student lessons" });
  }
};
