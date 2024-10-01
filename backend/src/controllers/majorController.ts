import { Request, Response } from "express";
import { prismaClient } from "..";

export async function getMajors(req: Request, res: Response) {
  try {
    const majors = await prismaClient.major.findMany();
    res.json(majors);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
