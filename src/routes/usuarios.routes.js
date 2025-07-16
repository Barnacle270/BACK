import express from 'express';
import {
  crearUsuario,
  listarUsuarios,
  actualizarUsuario,
  cambiarRol,
  desactivarUsuario,
  activarUsuario
} from '../controllers/usuarios.controller.js';

const router = express.Router();

// Crear usuario
router.post('/', crearUsuario);

// Listar todos los usuarios
router.get('/', listarUsuarios);

// Actualizar datos de usuario (nombre, email, etc.)
router.put('/:id', actualizarUsuario);

// Cambiar rol del usuario
router.patch('/:id/rol', cambiarRol);

// Desactivar usuario
router.patch('/:id/desactivar', desactivarUsuario);

// Activar usuario
router.patch('/:id/activar', activarUsuario);

export default router;
