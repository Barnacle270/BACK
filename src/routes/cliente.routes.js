import express from 'express';
import {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente
} from '../controllers/cliente.controller.js';

const router = express.Router();

// Crear cliente
router.post('/clientes', crearCliente);

// Listar todos los clientes
router.get('/clientes', obtenerClientes);

// Obtener un cliente por ID
router.get('/clientes/:id', obtenerClientePorId);

// Editar cliente
router.put('/clientes/:id', actualizarCliente);

export default router;
