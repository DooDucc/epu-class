import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getMajors } from "../controllers/majorController";

export { Router } from "express";

const majorRoutes = Router();

majorRoutes.get("/", [authMiddleware], getMajors);

export default majorRoutes;
