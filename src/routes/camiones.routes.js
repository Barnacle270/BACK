import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { createCamiones, getCamiones } from "../controllers/camiones.controller.js";

const router = Router();

router.post("/camiones", authRequired, createCamiones);
router.get("/camiones", authRequired, getCamiones);

export default router;
