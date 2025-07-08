import express from 'express';
import multer from 'multer';
import { actualizarCamposManuales, editarServicio, eliminarServicio, importarXML, listarServiciosPendientes, listarServiciosPorFecha, marcarComoDevuelto, obtenerServicioPorId } from '../controllers/servicio.controller.js';

import { authRequired } from '../middlewares/validateToken.js'
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Configuración de multer para subir XML
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Ruta para importar servicio desde XML
router.post('/importar', upload.single('xml'), importarXML);
router.put('/:id/manual', actualizarCamposManuales);

router.get('/pendientes', authRequired, listarServiciosPendientes);

router.put('/:id/devolver', marcarComoDevuelto);
router.get('/', listarServiciosPorFecha); // se combina con /api/servicios

router.get('/:id', obtenerServicioPorId);
router.put('/:id/editar', editarServicio);
router.delete('/:id', eliminarServicio);

export default router;
