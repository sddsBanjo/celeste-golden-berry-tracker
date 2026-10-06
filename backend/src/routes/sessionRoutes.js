import { Router } from "express";
import * as sessionController from "../controllers/sessionController.js";
import { validateSession } from "../middlewares/validateSession.js";

const router = Router();

router.post("/", validateSession, sessionController.create);

export default router;