import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  getStudentsByCourseAndYear,
  getStudentsByYear,
  getSubmittedExerciseStats,
  getCourseExerciseStats,
  getClassExerciseStats,
} from "../controllers/reportController";

export { Router } from "express";

const reportRoutes = Router();

reportRoutes.get(
  "/students/classes/:classId/:year",
  [authMiddleware],
  getStudentsByYear
);

reportRoutes.get(
  "/students/courses/:courseId/:year",
  [authMiddleware],
  getStudentsByCourseAndYear
);

reportRoutes.get(
  "/submitted-exercises/:lessonId",
  [authMiddleware],
  getSubmittedExerciseStats
);

reportRoutes.get(
  "/course-exercise-stats/:courseId",
  [authMiddleware],
  getCourseExerciseStats
);

reportRoutes.get(
  "/class-exercise-stats/:classId",
  [authMiddleware],
  getClassExerciseStats
);

export default reportRoutes;
