import { Router } from "express";
import * as chapterController from "../controllers/chapterController.js";
import { validateChapter } from "../middlewares/validateChapter.js";

const router = Router();
router.get("/", chapterController.getAll);
router.post("/", validateChapter, chapterController.create);

export default router;