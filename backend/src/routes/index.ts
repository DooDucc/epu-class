import { Router } from "express";
import authRoutes from "./auth";
import classRoutes from "./class";
import courseRoutes from "./course";
import lessonRoutes from "./lesson";
import uploadRoute from "./upload";
import studentRoutes from "./student";
import exerciseRoutes from "./exercise";
import reportRoutes from "./report";

const router = Router();

router.use("/auth", authRoutes);
router.use("/classes", classRoutes);
router.use("/courses", courseRoutes);
router.use("/lessons", lessonRoutes);
router.use("/upload", uploadRoute);
router.use("/students", studentRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/reports", reportRoutes);
export default router;
