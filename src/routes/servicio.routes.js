import express from 'express';
import multer from 'multer';
import {
  actualizarCamposManuales,
  actualizarEstadoFacturacion,
  editarServicio,
  eliminarServicio,
  importarXML,
  importarXMLMasivo,
  listarServiciosPendientes,
  listarServiciosPorFecha,
  marcarComoDevuelto,
  obtenerServicioPorId,
  obtenerServiciosSinFacturar,
  recepcionarLoteServicios
} from '../controllers/servicio.controller.js';

import { authRequired } from '../middlewares/validateToken.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// ✅ Configuración de multer para compatibilidad con Render
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.NODE_ENV === 'production' ? '/tmp' : 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// RUTAS ESPECÍFICAS ANTES
router.post('/importar', upload.single('xml'), importarXML);
router.post('/importar-masivo', upload.array('xmls'), importarXMLMasivo);

router.put('/:id/manual', actualizarCamposManuales);
router.put('/:id/devolver', marcarComoDevuelto);
router.put('/:id/editar', editarServicio);
router.put('/:id/facturacion', actualizarEstadoFacturacion);
router.put('/facturacion/lote', recepcionarLoteServicios);

router.get('/pendientes', authRequired, listarServiciosPendientes);
router.get('/sin-factura', obtenerServiciosSinFacturar); // DEBE IR ANTES DE /:id

router.get('/', listarServiciosPorFecha);

// RUTA CON PARÁMETRO AL FINAL
router.get('/:id', obtenerServicioPorId);
router.delete('/:id', eliminarServicio);

export default router;
