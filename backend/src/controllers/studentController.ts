import { prismaClient } from "..";
import { Request, Response } from "express";

export const getStudentsInTeacherClasses = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const { id: teacherId } = req.user;
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const where = search
      ? {
          OR: [
            {
              studentCode: { contains: search as string },
            },
            {
              user: {
                fullName: { contains: search as string },
              },
            },
          ],
        }
      : {};

    const studentsInClasses = await prismaClient.student.findMany({
      where: {
        classes: {
          some: {
            teacherId,
          },
        },
        ...where,
      },
      include: {
        user: {
          select: {
            fullName: true,
            avatar: true,
            phone: true,
          },
        },
        classes: {
          where: {
            teacherId,
          },
          select: {
            classCode: true,
            className: true,
            lessons: {
              select: {
                id: true,
                title: true,
                userProgress: true,
              },
            },
          },
        },
      },
      skip: offset,
      take: limitNumber,
    });

    const totalStudents = await prismaClient.student.count({
      where: {
        classes: {
          some: {
            teacherId,
          },
        },
        ...where,
      },
    });

    const formattedStudents = studentsInClasses.map((student) => ({
      id: student.id,
      studentCode: student.studentCode,
      user: student.user,
      classes: student.classes.map((cls) => ({
        classCode: cls.classCode,
        className: cls.className,
        lessons: cls.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          userProgress: lesson.userProgress,
        })),
      })),
    }));

    return res.status(200).json({
      students: formattedStudents,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalStudents / limitNumber),
      totalStudents,
    });
  } catch (error) {
    console.error("Error fetching students in teacher classes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId || typeof studentId !== "string") {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await prismaClient.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true,
            avatar: true,
            isActive: true,
          },
        },
        classes: {
          select: {
            id: true,
            classCode: true,
            className: true,
            thumbnail: true,
            lessons: {
              select: {
                id: true,
                title: true,
                desc: true,
                position: true,
                isPublished: true,
                videoUrl: true,
                videoDuration: true,
                userProgress: {
                  where: {
                    studentId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Restructure the data to include progress information directly in lessons
    const classesWithProgress = student.classes.map((cls) => ({
      ...cls,
      lessons: cls.lessons.map((lesson) => ({
        ...lesson,
        isCompleted: lesson.userProgress[0]?.isCompleted || false,
      })),
    }));

    const response = {
      id: student.id,
      studentCode: student.studentCode,
      user: {
        ...student.user,
        class: student.class,
      },
      classes: classesWithProgress,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStudentFromClass = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Missing studentId" });
    }

    // Remove student from all classes taught by the current teacher
    // Get classes taught by the current teacher
    const teacherClasses = await prismaClient.class.findMany({
      // @ts-ignore
      where: { teacherId: req.user.id },
      select: { id: true },
    });

    // Remove student from each class
    for (const cls of teacherClasses) {
      await prismaClient.class.update({
        where: { id: cls.id },
        data: {
          students: {
            disconnect: { id: studentId },
          },
        },
      });
    }

    // Get classes
    const classes = await prismaClient.class.findMany({
      // @ts-ignore
      where: { teacherId: req.user.id },
      select: { id: true },
    });

    const classIds = classes.map((cls) => cls.id);

    for (const classId of classIds) {
      await prismaClient.class.update({
        where: { id: classId },
        data: {
          students: {
            disconnect: { id: studentId },
          },
        },
      });
    }

    // Remove student's progress for lessons in the classes
    await prismaClient.userProgress.deleteMany({
      where: {
        studentId,
        lesson: {
          class: {
            id: { in: classIds },
          },
        },
      },
    });

    return res.status(200).json({ message: "Student removed from class" });
  } catch (error) {
    console.error("Error deleting student from class:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
