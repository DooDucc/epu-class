import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  getLessons,
  createLesson,
  getLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
  updateLessonPositions,
  updateLessonProgress,
  updateNote,
  getNote,
  submitExercise,
  getSubmittedExercise,
  getStudentLessons,
} from "../controllers/lessonController";

export { Router } from "express";

const lessonRoutes = Router();

lessonRoutes.get("/", [authMiddleware], getLessons);
lessonRoutes.get("/all/:courseId?", [authMiddleware], getAllLessons);
lessonRoutes.get("/student/:studentId", [authMiddleware], getStudentLessons);
lessonRoutes.get("/:id", [authMiddleware], getLesson);
lessonRoutes.get("/note/:lessonId/:studentId", [authMiddleware], getNote);
lessonRoutes.get(
  "/submitted-exercise/:lessonId/:studentId",
  [authMiddleware],
  getSubmittedExercise
);
lessonRoutes.post("/submit-exercise", [authMiddleware], submitExercise);
lessonRoutes.post("/", [authMiddleware], createLesson);
lessonRoutes.patch(
  "/update-positions",
  [authMiddleware],
  updateLessonPositions
);
lessonRoutes.patch("/progress", [authMiddleware], updateLessonProgress);
lessonRoutes.patch("/note", [authMiddleware], updateNote);
lessonRoutes.patch("/:id", [authMiddleware], updateLesson);
lessonRoutes.delete("/:id", [authMiddleware], deleteLesson);

export default lessonRoutes;
