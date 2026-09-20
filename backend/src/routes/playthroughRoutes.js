import { Router } from "express";
import * as playthroughController from "../controllers/playthroughController.js";

const router = Router();
router.get("/", playthroughController.getAll);

export default router;