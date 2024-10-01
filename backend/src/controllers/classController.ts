import { Request, Response } from "express";
import { prismaClient } from "..";

export const getClasses = async (req: Request, res: Response) => {
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
              { className: { contains: search as string } },
              { classCode: { contains: search as string } },
              { id: { contains: search as string } },
            ],
          }
        : {}),
    };

    const [classes, totalCount] = await Promise.all([
      prismaClient.class.findMany({
        where,
        include: {
          major: true,
          teacher: {
            include: {
              user: true,
            },
          },
          courses: true,
          students: true,
        },
        skip,
        take: limitNumber,
      }),
      prismaClient.class.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.status(200).json({
      classes,
      currentPage: pageNumber,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "An error occurred while fetching classes" });
  }
};

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await prismaClient.class.findMany({
      include: {
        major: true,
        teacher: {
          include: {
            user: true,
          },
        },
        courses: true,
        students: true,
      },
    });

    res.status(200).json({
      classes,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "An error occurred while fetching classes" });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const {
      classCode,
      className,
      majorId,
      isPublished,
      thumbnailUrl,
      teacherId,
    } = req.body;

    if (!classCode || !className || !majorId || !teacherId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newClass = await prismaClient.class.create({
      data: {
        classCode,
        className,
        majorId,
        isPublished: isPublished || false,
        thumbnail: thumbnailUrl,
        teacherId,
      },
      include: {
        major: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the class" });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { className, majorId, isPublished, thumbnailUrl } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const existingClass = await prismaClient.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    const updatedClass = await prismaClient.class.update({
      where: { id },
      data: {
        className: className || undefined,
        majorId: majorId || undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        thumbnail: thumbnailUrl || undefined,
      },
      include: {
        major: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the class" });
  }
};

export const getClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const classData = await prismaClient.class.findUnique({
      where: { id },
      include: {
        major: true,
        teacher: {
          include: {
            user: true,
          },
        },
        courses: true,
        students: true,
      },
    });

    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }

    if (classData.teacherId && !classData.teacher) {
      const teacherData = await prismaClient.user.findUnique({
        where: { id: classData.teacherId },
      });
      // @ts-ignore
      classData.teacher = teacherData;
    }

    res.status(200).json(classData);
  } catch (error) {
    console.error("Error fetching class:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the class" });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    // Check if the class exists
    const existingClass = await prismaClient.class.findUnique({
      where: { id },
      include: { courses: true },
    });

    if (!existingClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Delete all related entities
    await prismaClient.$transaction(async (prisma) => {
      // Get all course IDs
      const courseIds = existingClass.courses.map((course) => course.id);

      // Delete all exercises, and attachments for each lesson in each course
      await prisma.exercise.deleteMany({
        where: { lesson: { courseId: { in: courseIds } } },
      });
      await prisma.attachment.deleteMany({
        where: { lesson: { courseId: { in: courseIds } } },
      });

      // Delete all lessons for each course
      await prisma.lesson.deleteMany({
        where: { courseId: { in: courseIds } },
      });

      // Delete all courses
      await prisma.course.deleteMany({
        where: { classId: id },
      });

      // Delete the class itself
      await prisma.class.delete({
        where: { id },
      });
    });

    res
      .status(200)
      .json({ message: "Class and all related entities deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the class" });
  }
};

export const getPublishedClasses = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 9, search = "", majorId = "" } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where = {
      isPublished: true,
      ...(search
        ? {
            OR: [{ className: { contains: search as string } }],
          }
        : {}),
      ...(majorId ? { majorId: majorId as string } : {}),
    };

    const [classes, totalCount] = await Promise.all([
      prismaClient.class.findMany({
        where,
        include: {
          major: true,
          teacher: {
            include: {
              user: true,
            },
          },
          courses: true,
          students: true,
        },
        skip,
        take: limitNumber,
      }),
      prismaClient.class.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    const classesWithTeacherInfo = await Promise.all(
      classes.map(async (classItem) => {
        if (classItem.teacherId) {
          const teacher = await prismaClient.teacher.findUnique({
            where: { id: classItem.teacherId },
            include: {
              user: true,
            },
          });
          return {
            ...classItem,
            teacher: teacher?.user || null,
          };
        }
        return classItem;
      })
    );

    res.status(200).json({
      classes: classesWithTeacherInfo,
      currentPage: pageNumber,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching published classes:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching published classes" });
  }
};

export const joinClass = async (req: Request, res: Response) => {
  try {
    const { classCode } = req.params;
    const { userId } = req.body;

    if (!classCode || !userId) {
      return res
        .status(400)
        .json({ error: "Class code and User ID are required" });
    }

    // Check if the class exists
    const existingClass = await prismaClient.class.findUnique({
      where: { classCode },
      include: { students: true },
    });

    if (!existingClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check if the student exists
    const student = await prismaClient.student.findFirst({
      where: { id: userId },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if the student is already in the class
    const isAlreadyStudent = existingClass.students.some(
      (s) => s.id === student.id
    );

    if (isAlreadyStudent) {
      return res.status(400).json({ error: "You are already in this class" });
    }

    // Add the student to the class
    const updatedClass = await prismaClient.class.update({
      where: { classCode },
      data: {
        students: {
          connect: { id: student.id },
        },
      },
      include: {
        students: true,
        major: true,
        teacher: {
          include: {
            user: true,
          },
        },
        courses: true,
      },
    });

    res.status(200).json({
      message: "Student successfully joined the class",
      class: updatedClass,
    });
  } catch (error) {
    console.error("Error joining class:", error);
    res
      .status(500)
      .json({ error: "An error occurred while joining the class" });
  }
};
