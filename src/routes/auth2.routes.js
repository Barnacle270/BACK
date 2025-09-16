import { Router } from "express";
import { register, login, verifyToken, logout } from "../controllers/auth2.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// públicas
router.post("/v2/register", register);
router.post("/v2/login", login);

// protegidas
router.get("/v2/verify", authRequired, verifyToken);
router.post("/v2/logout", authRequired, logout);

export default router;
