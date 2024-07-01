import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { createTransporte, getTransporte } from "../controllers/transporte.controller.js";
import validationTransporte from "../schemas/transporte.schema.js";


const router = Router();

router.post("/transporte", authRequired, validationTransporte(), createTransporte);
router.get("/transporte", authRequired, getTransporte);

export default router;
