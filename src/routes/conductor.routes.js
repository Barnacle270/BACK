import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { createConductor, getConductor } from "../controllers/conductor.controller.js";

const router = Router();

router.post("/conductor", authRequired, createConductor);
router.get("/conductor", authRequired, getConductor);

export default router;
