import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  getStudentsByLessonAndYear,
  getStudentsByYear,
  getLessonExerciseStats,
  getClassExerciseStats,
  getTotalInfo,
  getTopStudentsByClass,
} from "../controllers/reportController";

export { Router } from "express";

const reportRoutes = Router();

reportRoutes.get(
  "/students/classes/:classId/:year",
  [authMiddleware],
  getStudentsByYear
);

reportRoutes.get(
  "/students/lessons/:lessonId/:year",
  [authMiddleware],
  getStudentsByLessonAndYear
);

reportRoutes.get(
  "/lesson-exercise-stats/:lessonId",
  [authMiddleware],
  getLessonExerciseStats
);

reportRoutes.get(
  "/class-exercise-stats/:classId",
  [authMiddleware],
  getClassExerciseStats
);

reportRoutes.get(
  "/top-students/:classId",
  [authMiddleware],
  getTopStudentsByClass
);

reportRoutes.get("/total-info", [authMiddleware], getTotalInfo);

export default reportRoutes;
