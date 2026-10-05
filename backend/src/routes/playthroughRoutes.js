import { Router } from "express";
import * as playthroughController from "../controllers/playthroughController.js";
import * as playthroughChapterController from "../controllers/playthroughChapterController.js";
import { validateId } from "../middlewares/validateId.js";
import { validatePlaythrough } from "../middlewares/validatePlaythrough.js";
import { validatePlaythroughChapter } from "../middlewares/validatePlaythroughChapter.js";

const router = Router();
router.get("/", playthroughController.getAll);
router.get("/:id", validateId, playthroughController.getById);
router.post("/", validatePlaythrough, playthroughController.create);
router.put("/:id", validateId, validatePlaythrough, playthroughController.update);
router.delete("/:id", validateId, playthroughController.remove);

router.post("/:id/chapters", validateId, validatePlaythroughChapter, playthroughChapterController.create);

export default router;