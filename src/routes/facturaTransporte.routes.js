import { Router } from 'express';
import multer from 'multer';
import {
  pagarFactura,
  obtenerFactura,
  listarFacturas
} from '../controllers/facturaTransporte.controller.js';
import { importarFacturasDesdeExcel } from '../controllers/facturaTransporte.controller.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/:idOrNumero/pagar', pagarFactura);
router.get('/:idOrNumero', obtenerFactura);
router.get('/', listarFacturas);

// 📥 Importar facturas desde Excel (archivo en campo "file")
router.post('/importar-excel', upload.single('file'), importarFacturasDesdeExcel);

export default router;
