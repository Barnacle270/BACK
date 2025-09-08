import express from 'express';
import multer from 'multer';
import {
  actualizarCamposManuales,
  actualizarEstadoFacturacion,
  anularServicio,
  debugServicios,
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

// ======================
// 📌 RUTAS ESPECÍFICAS
// ======================
router.post('/importar', upload.single('xml'), importarXML);
router.post('/importar-masivo', upload.array('xmls'), importarXMLMasivo);

router.put('/:id/manual', actualizarCamposManuales);
router.put('/:id/devolver', marcarComoDevuelto);
router.put('/:id/editar', editarServicio);
router.put('/:id/facturacion', actualizarEstadoFacturacion);
router.put('/facturacion/lote', recepcionarLoteServicios);

// ======================
// 📌 RUTAS FIJAS (antes de /:id)
// ======================
router.get('/pendientes', listarServiciosPendientes);
router.get('/sin-factura', obtenerServiciosSinFacturar);
router.get('/debug', debugServicios); // ⚡️ debug ahora funciona bien
router.get('/', listarServiciosPorFecha);

// ======================
// 📌 RUTAS DINÁMICAS (al final)
// ======================
router.put('/:id/anular', anularServicio);
router.get('/:id', obtenerServicioPorId);
router.delete('/:id', eliminarServicio);

export default router;
