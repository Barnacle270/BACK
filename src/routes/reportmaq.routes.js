import { Router } from "express";

import { createReportmaq, getReportmaq } from "../controllers/reportmaq.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/maq", authRequired, createReportmaq);
router.get("/maq", authRequired, getReportmaq);

export default router;
