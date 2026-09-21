import { Router } from "express";
import * as chapterController from "../controllers/chapterController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateChapter } from "../middlewares/validateChapter.js";

const router = Router();
router.get("/", chapterController.getAll);
router.get("/:id", validateId, chapterController.getById);
router.post("/", validateChapter, chapterController.create);
router.put("/:id", validateId, validateChapter, chapterController.update);

export default router;