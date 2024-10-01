import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  deleteStudentFromClass,
  getStudent,
  getStudentsInTeacherClasses,
} from "../controllers/studentController";

export { Router } from "express";

const studentRoutes = Router();

studentRoutes.get("/:studentId", [authMiddleware], getStudent);
studentRoutes.get("/", [authMiddleware], getStudentsInTeacherClasses);
studentRoutes.delete("/:studentId", [authMiddleware], deleteStudentFromClass);

export default studentRoutes;
