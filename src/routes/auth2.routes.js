import { Router } from "express";
import { login, verifyToken, logout, refresh } from "../controllers/auth2.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// públicas
router.post("/v2/login",login);

// protegidas
router.get("/v2/verify", authRequired, verifyToken);

// refresh (para renovar access token usando la cookie de refresh)
router.get("/v2/refresh", refresh);

// logout
router.post("/v2/logout", authRequired, logout);

export default router;
