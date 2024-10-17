import { Request, Response } from "express";
import { prismaClient } from "..";

export const getCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const classData = await prismaClient.class.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
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
