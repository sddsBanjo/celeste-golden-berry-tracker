import { Router } from "express";
import * as sessionController from "../controllers/sessionController.js";
import { validateSession } from "../middlewares/validateSession.js";
import { validateId } from "../middlewares/validateId.js";

const router = Router();

router.get("/", sessionController.getAll);
router.get("/:id", validateId, sessionController.getById);
router.post("/", validateSession, sessionController.create);
router.delete("/:id", validateId, sessionController.remove);

export default router;