import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { createTransporte, getTransporte } from "../controllers/transporte.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { transporteSchema } from "../schemas/transporte.schema.js";


const router = Router();

router.post("/transporte", authRequired, validateSchema(transporteSchema),createTransporte);
router.get("/transporte", authRequired,getTransporte);

export default router;
