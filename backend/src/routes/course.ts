import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getCourse } from "../controllers/courseController";

export { Router } from "express";

const courseRoutes = Router();

courseRoutes.get("/:id", [authMiddleware], getCourse);

export default courseRoutes;
