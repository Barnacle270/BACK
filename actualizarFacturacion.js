import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real

// 2. Lista de guías con datos de facturación
const facturas = [

  { "numeroGuia": "EG03-5536", "numeroFactura": "F001-00004207", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5535", "numeroFactura": "F001-00004207", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5534", "numeroFactura": "F001-00004207", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5532", "numeroFactura": "F001-00004207", "fechaFacturacion": "2025-09-04" },



  { "numeroGuia": "EG03-5560", "numeroFactura": "F001-00004232", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5557", "numeroFactura": "F001-00004232", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5558", "numeroFactura": "F001-00004232", "fechaFacturacion": "2025-09-04" },

  { "numeroGuia": "EG03-5481", "numeroFactura": "F001-00004233", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5528", "numeroFactura": "F001-00004233", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5529", "numeroFactura": "F001-00004233", "fechaFacturacion": "2025-09-04" },

  { "numeroGuia": "EG03-5546", "numeroFactura": "F001-00004234", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5554", "numeroFactura": "F001-00004234", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5553", "numeroFactura": "F001-00004234", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5547", "numeroFactura": "F001-00004234", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5548", "numeroFactura": "F001-00004234", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5559", "numeroFactura": "F001-00004234", "fechaFacturacion": "2025-09-04" },


  { "numeroGuia": "EG03-5511", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5513", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5518", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5519", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5520", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5521", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5523", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5524", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5526", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5533", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5540", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5495", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5503", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5555", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5552", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5551", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5561", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5562", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5563", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5564", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5565", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5567", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },
  { "numeroGuia": "EG03-5566", "numeroFactura": "F001-00004235", "fechaFacturacion": "2025-09-04" },

  { "numeroGuia": "EG03-5550", "numeroFactura": "F001-00004236", "fechaFacturacion": "2025-09-04" },











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
