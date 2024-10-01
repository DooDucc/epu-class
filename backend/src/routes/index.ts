import { Router } from "express";
import authRoutes from "./auth";
import classRoutes from "./class";
import majorRoutes from "./major";
import courseRoutes from "./course";
import lessonRoutes from "./lesson";
import uploadRoute from "./upload";
import studentRoutes from "./student";
import exerciseRoutes from "./exercise";

const router = Router();

router.use("/auth", authRoutes);
router.use("/classes", classRoutes);
router.use("/majors", majorRoutes);
router.use("/courses", courseRoutes);
router.use("/lessons", lessonRoutes);
router.use("/upload", uploadRoute);
router.use("/students", studentRoutes);
router.use("/exercises", exerciseRoutes);

export default router;
