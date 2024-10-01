import { Request, Response } from "express";
import { prismaClient } from "..";

export const getCourses = async (req: Request, res: Response) => {
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
              { class: { classCode: { contains: search as string } } },
              { id: { contains: search as string } },
            ],
          }
        : {}),
    };

    const [courses, totalCount] = await Promise.all([
      prismaClient.course.findMany({
        where,
        include: {
          teacher: true,
          class: true,
          lessons: true,
          students: true,
        },
        skip,
        take: limitNumber,
      }),
      prismaClient.course.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    const coursesWithTeacherInfo = await Promise.all(
      courses.map(async (course) => {
        if (course.teacherId) {
          const teacherUser = await prismaClient.user.findUnique({
            where: { id: course.teacherId },
          });
          return { ...course, teacher: teacherUser };
        }
        return course;
      })
    );

    res.status(200).json({
      courses: coursesWithTeacherInfo,
      currentPage: pageNumber,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prismaClient.course.findMany({
      include: {
        teacher: true,
        class: true,
        lessons: true,
        students: true,
      },
    });

    res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "An error occurred while fetching courses" });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, desc, imageUrl, isPublished, teacherId, classId } = req.body;

    const newCourse = await prismaClient.course.create({
      data: {
        title,
        desc,
        imageUrl,
        isPublished,
        teacherId,
        classId,
      },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const courseData = await prismaClient.course.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        class: true,
        lessons: {
          include: {
            userProgress: true,
            exercises: true,
            attachments: true,
          },
          orderBy: {
            position: "asc",
          },
        },
        students: true,
      },
    });

    if (!courseData) {
      return res.status(404).json({ error: "Class not found" });
    }

    if (courseData.teacherId && !courseData.teacher) {
      const teacherData = await prismaClient.user.findUnique({
        where: { id: courseData.teacherId },
      });
      // @ts-ignore
      courseData.teacher = teacherData;
    }

    res.status(200).json(courseData);
  } catch (error) {
    console.error("Error fetching class:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the class" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, desc, imageUrl, isPublished, teacherId, classId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const updatedCourse = await prismaClient.course.update({
      where: { id },
      data: {
        title,
        desc,
        imageUrl,
        isPublished,
        teacherId,
        classId,
      },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    // Delete all related data in a transaction
    await prismaClient.$transaction(async (prisma) => {
      // Get all lessons for the course
      const lessons = await prisma.lesson.findMany({
        where: { courseId: id },
        select: { id: true },
      });

      const lessonIds = lessons.map((lesson) => lesson.id);

      // Delete all exercises, and attachments for each lesson
      await prisma.exercise.deleteMany({
        where: { lessonId: { in: lessonIds } },
      });
      await prisma.attachment.deleteMany({
        where: { lessonId: { in: lessonIds } },
      });

      // Delete all lessons for the course
      await prisma.lesson.deleteMany({ where: { courseId: id } });

      // Delete the course
      await prisma.course.delete({ where: { id } });
    });

    res
      .status(200)
      .json({ message: "Course and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

export const registerCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Check if the course exists
    const course = await prismaClient.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the student exists
    const student = await prismaClient.student.findFirst({
      where: { id: userId },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updatedCourse = await prismaClient.course.update({
      where: { id },
      data: {
        students: {
          connect: { id: student.id },
        },
      },
      include: {
        students: true,
      },
    });

    res.status(200).json({
      message: "User successfully registered for the course",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error registering for course:", error);
    res.status(500).json({ error: "Failed to register for course" });
  }
};
