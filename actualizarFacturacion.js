import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real

// 2. Lista de guías con datos de facturación
const facturas = [

  { "numeroGuia": "EG03-5496", "numeroFactura": "F001-00004237", "fechaFacturacion": "2025-09-08" },
  { "numeroGuia": "EG03-5499", "numeroFactura": "F001-00004237", "fechaFacturacion": "2025-09-08" },
  { "numeroGuia": "EG03-5500", "numeroFactura": "F001-00004237", "fechaFacturacion": "2025-09-08" },
  { "numeroGuia": "EG03-5498", "numeroFactura": "F001-00004237", "fechaFacturacion": "2025-09-08" },
  { "numeroGuia": "EG03-5594", "numeroFactura": "F001-00004237", "fechaFacturacion": "2025-09-08" },

  { "numeroGuia": "G010-1480", "numeroFactura": "F001-00004238", "fechaFacturacion": "2025-09-08" },

  { "numeroGuia": "G010-1481", "numeroFactura": "F001-00004239", "fechaFacturacion": "2025-09-08" },

  { "numeroGuia": "G010-1482", "numeroFactura": "F001-00004240", "fechaFacturacion": "2025-09-08" },

  { "numeroGuia": "EG03-5569", "numeroFactura": "F001-00004241", "fechaFacturacion": "2025-09-08" },

  { "numeroGuia": "EG03-5570", "numeroFactura": "F001-00004242", "fechaFacturacion": "2025-09-08" },

  { "numeroGuia": "G010-1486", "numeroFactura": "F001-00004243", "fechaFacturacion": "2025-09-08" },

  { "numeroGuia": "EG03-5576", "numeroFactura": "F001-00004244", "fechaFacturacion": "2025-09-08" },

  { "numeroGuia": "EG03-5572", "numeroFactura": "F001-00004245", "fechaFacturacion": "2025-09-09" },

  { "numeroGuia": "EG03-5487", "numeroFactura": "F001-00004246", "fechaFacturacion": "2025-09-09" },

  { "numeroGuia": "EG03-5490", "numeroFactura": "F001-00004246", "fechaFacturacion": "2025-09-09" },

  { "numeroGuia": "EG03-5475", "numeroFactura": "F001-00004247", "fechaFacturacion": "2025-09-09" },
  { "numeroGuia": "EG03-5476", "numeroFactura": "F001-00004247", "fechaFacturacion": "2025-09-09" },

  { "numeroGuia": "EG03-5470", "numeroFactura": "F001-00004248", "fechaFacturacion": "2025-09-09" },
  { "numeroGuia": "EG03-5471", "numeroFactura": "F001-00004248", "fechaFacturacion": "2025-09-09" },
  { "numeroGuia": "EG03-5473", "numeroFactura": "F001-00004248", "fechaFacturacion": "2025-09-09" },

  { "numeroGuia": "EG03-5414", "numeroFactura": "F001-00004249", "fechaFacturacion": "2025-09-10" },

  { "numeroGuia": "EG03-5537", "numeroFactura": "F001-00004250", "fechaFacturacion": "2025-09-10" },

  { "numeroGuia": "EG03-5541", "numeroFactura": "F001-00004250", "fechaFacturacion": "2025-09-10" },

  { "numeroGuia": "EG03-5578", "numeroFactura": "F001-00004251", "fechaFacturacion": "2025-09-10" },
  { "numeroGuia": "EG03-5579", "numeroFactura": "F001-00004251", "fechaFacturacion": "2025-09-10" },

  { "numeroGuia": "EG03-5590", "numeroFactura": "F001-00004252", "fechaFacturacion": "2025-09-10" },
  { "numeroGuia": "EG03-5591", "numeroFactura": "F001-00004252", "fechaFacturacion": "2025-09-10" },
  { "numeroGuia": "EG03-5595", "numeroFactura": "F001-00004252", "fechaFacturacion": "2025-09-10" },
  { "numeroGuia": "EG03-5596", "numeroFactura": "F001-00004252", "fechaFacturacion": "2025-09-10" },
  { "numeroGuia": "EG03-5598", "numeroFactura": "F001-00004252", "fechaFacturacion": "2025-09-10" },

  { "numeroGuia": "EG03-5597", "numeroFactura": "F001-00004253", "fechaFacturacion": "2025-09-10" },

  { "numeroGuia": "EG03-5589", "numeroFactura": "F001-00004254", "fechaFacturacion": "2025-09-10" },

  { "numeroGuia": "EG03-5588", "numeroFactura": "F001-00004255", "fechaFacturacion": "2025-09-10" },

  { "numeroGuia": "G010-1487", "numeroFactura": "F001-00004256", "fechaFacturacion": "2025-09-11" },

  { "numeroGuia": "EG03-5593", "numeroFactura": "F001-00004257", "fechaFacturacion": "2025-09-11" },


  { "numeroGuia": "G010-1497", "numeroFactura": "F001-00004258", "fechaFacturacion": "2025-09-11" },

  { "numeroGuia": "G010-1496", "numeroFactura": "F001-00004259", "fechaFacturacion": "2025-09-11" },

  { "numeroGuia": "EG03-5582", "numeroFactura": "F001-00004260", "fechaFacturacion": "2025-09-11" },



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
