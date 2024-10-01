import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { uploadFile, uploadFiles } from "../controllers/uploadController";

export { Router } from "express";

const majorRoutes = Router();

majorRoutes.post("/file", [authMiddleware], uploadFile);
majorRoutes.post("/files", [authMiddleware], uploadFiles);

export default majorRoutes;
