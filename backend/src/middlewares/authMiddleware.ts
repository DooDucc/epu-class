import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { ROLE } from "../utils";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json("Unauthorized!");
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const student = await prismaClient.student.findFirst({
      where: {
        userId: payload?.userId,
      },
    });

    const teacher = await prismaClient.teacher.findFirst({
      where: {
        userId: payload?.userId,
      },
    });

    const user = await prismaClient.user.findFirst({
      where: {
        id: payload?.userId,
      },
    });

    if (!user) {
      res.status(401).json("Unauthorized!");
      return;
    }

    if (student) {
      // @ts-ignore
      req.user = {
        ...user,
        role: ROLE.STUDENT,
        studentCode: student.studentCode,
        id: student.id,
      };
    } else if (teacher) {
      // @ts-ignore
      req.user = {
        ...user,
        role: ROLE.TEACHER,
        email: teacher.email,
        id: teacher.id,
      };
    } else {
      // @ts-ignore
      req.user = user;
    }

    next();
  } catch (error) {
    res.status(401).json("Unauthorized!");
  }
};

export default authMiddleware;
