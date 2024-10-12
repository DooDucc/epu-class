import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
  getCourses,
  registerCourse,
  updateCourse,
} from "../controllers/courseController";

export { Router } from "express";

const courseRoutes = Router();

courseRoutes.get("/", [authMiddleware], getCourses);
courseRoutes.get("/all", [authMiddleware], getAllCourses);
courseRoutes.get("/:id", [authMiddleware], getCourse);
courseRoutes.post("/", [authMiddleware], createCourse);
courseRoutes.post("/:id/register", [authMiddleware], registerCourse);
courseRoutes.patch("/:id", [authMiddleware], updateCourse);
courseRoutes.delete("/:id", [authMiddleware], deleteCourse);

export default courseRoutes;
