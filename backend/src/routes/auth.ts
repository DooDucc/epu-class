import { Router } from "express";
import {
  login,
  me,
  register,
  updateUserProfile,
} from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

export { Router } from "express";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.get("/me", [authMiddleware], me);
authRoutes.put("/profile", [authMiddleware], updateUserProfile);

export default authRoutes;
