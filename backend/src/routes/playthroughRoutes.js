import { Router } from "express";
import * as playthroughController from "../controllers/playthroughController.js";
import { validateId } from "../middlewares/validateId.js";
import { validatePlaythrough } from "../middlewares/validatePlaythrough.js";

const router = Router();
router.get("/", playthroughController.getAll);
router.get("/:id", validateId, playthroughController.getById);
router.post("/", validatePlaythrough, playthroughController.create);
router.put("/:id", validateId, validatePlaythrough, playthroughController.update);

export default router;