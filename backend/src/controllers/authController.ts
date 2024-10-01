import { Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ROLE } from "../utils";

const TOKEN_EXPIRATION = "30d";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, studentCode, password } = req.body;
    if (email) {
      const teacher = await prismaClient.teacher.findFirst({
        where: {
          email,
        },
      });

      if (!teacher) {
        res.status(404).json("User not found!");
        return;
      }

      if (!compareSync(password, teacher.password)) {
        res.status(404).json("User not found!");
        return;
      }

      const token = jwt.sign(
        {
          userId: teacher.userId,
        },
        process.env.JWT_SECRET!,
        { expiresIn: TOKEN_EXPIRATION }
      );

      res.json({ token, role: ROLE.TEACHER });
    } else if (studentCode) {
      const student = await prismaClient.student.findFirst({
        where: {
          studentCode,
        },
      });

      if (!student) {
        res.status(404).json("User not found!");
        return;
      }

      if (!compareSync(password, student.password)) {
        res.status(401).json("Invalid password. Please try again!");
        return;
      }

      const token = jwt.sign(
        {
          userId: student.userId,
        },
        process.env.JWT_SECRET!,
        { expiresIn: TOKEN_EXPIRATION }
      );

      res.json({ token, role: ROLE.STUDENT });
    }
  } catch (error) {}
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, studentCode, fullName, phone, avatar, password } = req.body;

    if (email) {
      const teacher = await prismaClient.teacher.findFirst({
        where: {
          email,
        },
      });

      if (teacher) {
        res.status(400).json("User already exists!");
        return;
      }

      const newUser = await prismaClient.user.create({
        data: {
          phone,
          fullName,
          avatar,
          isActive: true,
        },
      });

      const newTeacher = await prismaClient.teacher.create({
        data: {
          email,
          password: hashSync(password, 10),
          userId: newUser?.id,
        },
      });

      res.json(newTeacher);
    } else if (studentCode) {
      const student = await prismaClient.student.findFirst({
        where: {
          studentCode,
        },
      });

      if (student) {
        res.status(400).json("User already exists!");
        return;
      }

      const newUser = await prismaClient.user.create({
        data: {
          phone,
          fullName,
          avatar,
          isActive: true,
        },
      });

      const newStudent = await prismaClient.student.create({
        data: {
          studentCode,
          password: hashSync(password, 10),
          userId: newUser?.id,
        },
      });

      const token = jwt.sign(
        {
          userId: newStudent.userId,
        },
        process.env.JWT_SECRET!,
        { expiresIn: TOKEN_EXPIRATION }
      );

      res.json({ ...newStudent, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Interval errors");
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const teacher = await prismaClient.teacher.findFirst({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
    });

    if (teacher) {
      // @ts-ignore
      res.json({ ...req.user, userId: teacher.userId, role: ROLE.TEACHER });
      return;
    }

    const student = await prismaClient.student.findFirst({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
    });

    if (student) {
      // @ts-ignore
      res.json({ ...req.user, userId: student.userId, role: ROLE.STUDENT });
    }
  } catch (error) {}
};
