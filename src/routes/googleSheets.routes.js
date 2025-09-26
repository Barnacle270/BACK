import express from "express";
import { getConductores, getTractos, getCarretas } from "../controllers/googleSheets.controller.js";

const router = express.Router();

router.get("/conductores", getConductores);
router.get("/tractos", getTractos);
router.get("/carretas", getCarretas);

export default router;
