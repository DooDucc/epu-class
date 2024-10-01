import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  getSubmittedExerciseById,
  getSubmittedExercises,
  updateExercise,
} from "../controllers/exerciseController";

export { Router } from "express";

const exerciseRoutes = Router();

exerciseRoutes.get("/", [authMiddleware], getSubmittedExercises);
exerciseRoutes.get("/:id", [authMiddleware], getSubmittedExerciseById);
exerciseRoutes.put("/:id", [authMiddleware], updateExercise);

export default exerciseRoutes;
