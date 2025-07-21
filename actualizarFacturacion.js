import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real

// 2. Lista de guías con datos de facturación
const facturas = [



{ numeroGuia: 'EG03-4980', numeroFactura: 'F001-00004025', fechaFacturacion: '2025-07-19' },
{ numeroGuia: 'EG03-4979', numeroFactura: 'F001-00004025', fechaFacturacion: '2025-07-19' },
{ numeroGuia: 'EG03-4987', numeroFactura: 'F001-00004025', fechaFacturacion: '2025-07-19' },
{ numeroGuia: 'EG03-4985', numeroFactura: 'F001-00004025', fechaFacturacion: '2025-07-19' },
{ numeroGuia: 'EG03-4986', numeroFactura: 'F001-00004025', fechaFacturacion: '2025-07-19' },
{ numeroGuia: 'EG03-4984', numeroFactura: 'F001-00004025', fechaFacturacion: '2025-07-19' },

{ numeroGuia: 'EG03-5015', numeroFactura: 'F001-00004026', fechaFacturacion: '2025-07-19' },
{ numeroGuia: 'EG03-5021', numeroFactura: 'F001-00004027', fechaFacturacion: '2025-07-19' },
{ numeroGuia: 'EG03-5012', numeroFactura: 'F001-00004028', fechaFacturacion: '2025-07-19' },


];

// 3. Script para actualizar en lote
const actualizarFacturas = async () => {
  let actualizados = 0;

  for (const { numeroGuia, numeroFactura, fechaFacturacion } of facturas) {
    const res = await Servicio.updateOne(
      { numeroGuia },
      {
        $set: {
          estadoFacturacion: 'FACTURADO',
          numeroFactura,
          fechaFacturacion: new Date(fechaFacturacion)
        }
      }
    );

    if (res.modifiedCount > 0) {
      console.log(`✔️ ${numeroGuia} actualizado`);
      actualizados++;
    } else {
      console.warn(`⚠️ ${numeroGuia} no encontrado o ya actualizado`);
    }
  }

  console.log(`\n✅ Total de guías actualizadas: ${actualizados}`);
  await mongoose.disconnect();
};

actualizarFacturas();
