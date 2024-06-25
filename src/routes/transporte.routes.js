import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { createTransporte, getTransporte } from "../controllers/transporte.controller.js";

const router = Router();

router.post("/transporte", authRequired, createTransporte);
router.get("/transporte", authRequired, getTransporte);

export default router;
