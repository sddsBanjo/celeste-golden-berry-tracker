import { Router } from "express";
import * as chapterController from "../controllers/chapterController.js";

const router = Router();
router.get("/", chapterController.getAll);

export default router;