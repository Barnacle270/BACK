import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real

// 2. Lista de guías con datos de facturación
const facturas = [

  { numeroGuia: 'EG03-4905', numeroFactura: 'E001-00004007', fechaFacturacion: '2025-07-15' },
  { numeroGuia: 'G010-1398', numeroFactura: 'E001-00004007', fechaFacturacion: '2025-07-15' },

  { numeroGuia: 'G010-1399', numeroFactura: 'E001-00004008', fechaFacturacion: '2025-07-15' },


  { numeroGuia: 'EG03-4940', numeroFactura: 'E001-00004009', fechaFacturacion: '2025-07-15' },

  { numeroGuia: 'EG03-4941', numeroFactura: 'E001-00004010', fechaFacturacion: '2025-07-15' },
  { numeroGuia: 'EG03-4977', numeroFactura: 'E001-00004011', fechaFacturacion: '2025-07-15' },
  { numeroGuia: 'EG03-4976', numeroFactura: 'E001-00004011', fechaFacturacion: '2025-07-15' },

  { numeroGuia: 'EG03-4965', numeroFactura: 'E001-00004012', fechaFacturacion: '2025-07-15' },
  { numeroGuia: 'EG03-4960', numeroFactura: 'E001-00004012', fechaFacturacion: '2025-07-15' },

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
