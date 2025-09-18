import express from "express";
import {
  crearUsuario,
  listarUsuarios,
  actualizarUsuario,
  cambiarRol,
  desactivarUsuario,
  activarUsuario,
  actualizarPerfil,
} from "../controllers/usuarios.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = express.Router();

// Crear usuario
router.post("/", crearUsuario);

// Listar todos los usuarios
router.get("/", listarUsuarios);

// ✅ Importante: poner primero la ruta de perfil
router.put("/perfil", authRequired, actualizarPerfil);

// Actualizar datos de usuario (solo admins)
router.put("/:id", actualizarUsuario);

// Cambiar rol del usuario
router.patch("/:id/rol", cambiarRol);

// Desactivar usuario
router.patch("/:id/desactivar", desactivarUsuario);

// Activar usuario
router.patch("/:id/activar", activarUsuario);

export default router;
