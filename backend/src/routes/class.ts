import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  getClasses,
  createClass,
  updateClass,
  getClass,
  getAllClasses,
  deleteClass,
  getPublishedClasses,
  joinClass,
} from "../controllers/classController";

export { Router } from "express";

const classRoutes = Router();

classRoutes.get("/", [authMiddleware], getClasses);
classRoutes.get("/all", [authMiddleware], getAllClasses);
classRoutes.get("/published", [authMiddleware], getPublishedClasses);
classRoutes.get("/:id", [authMiddleware], getClass);
classRoutes.post("/", [authMiddleware], createClass);
classRoutes.post("/:classCode/join", [authMiddleware], joinClass);
classRoutes.patch("/:id", [authMiddleware], updateClass);
classRoutes.delete("/:id", [authMiddleware], deleteClass);

export default classRoutes;
