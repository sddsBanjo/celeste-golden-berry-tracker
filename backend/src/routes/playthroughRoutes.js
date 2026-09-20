import { Router } from "express";
import * as playthroughController from "../controllers/playthroughController.js";
import { validatePlaythrough } from "../middlewares/validatePlaythrough.js";

const router = Router();
router.get("/", playthroughController.getAll);
router.get("/:id", playthroughController.getById);
router.post("/", validatePlaythrough, playthroughController.create);

export default router;