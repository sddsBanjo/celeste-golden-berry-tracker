import { Router } from "express";
import * as sessionController from "../controllers/sessionController.js";

const router = Router();

router.post("/", sessionController.create);

export default router;