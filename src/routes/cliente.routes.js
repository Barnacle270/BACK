import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { createCliente, getCliente } from "../controllers/cliente.controller.js";

const router = Router();

router.post("/cliente", authRequired, createCliente);
router.get("/cliente", authRequired, getCliente);

export default router;
