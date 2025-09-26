import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real

// 2. Lista de guías con datos de facturación
const facturas = [

  {
    "numeroGuia": "EG03-5653", "numeroFactura": "F001-00004328", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5656", "numeroFactura": "F001-00004328", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5655", "numeroFactura": "F001-00004328", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5586", "numeroFactura": "F001-00004329", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5584", "numeroFactura": "F001-00004329", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5585", "numeroFactura": "F001-00004329", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5674", "numeroFactura": "F001-00004330", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5672", "numeroFactura": "F001-00004330", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5671", "numeroFactura": "F001-00004330", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5670", "numeroFactura": "F001-00004330", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5669", "numeroFactura": "F001-00004330", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5568", "numeroFactura": "F001-00004331", "fechaFacturacion": "2025-09-24"
  },

  {
    "numeroGuia": "EG03-5575", "numeroFactura": "F001-00004331", "fechaFacturacion": "2025-09-24"
  },

  {
    "numeroGuia": "EG03-5583", "numeroFactura": "F001-00004331", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5631", "numeroFactura": "F001-00004332", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5633", "numeroFactura": "F001-00004332", "fechaFacturacion": "2025-09-24"
  },

  {
    "numeroGuia": "EG03-4709", "numeroFactura": "F001-00004333", "fechaFacturacion": "2025-09-24"
  },

  {
    "numeroGuia": "EG03-5713", "numeroFactura": "F001-00004334", "fechaFacturacion": "2025-09-24"
  },
  {
    "numeroGuia": "EG03-5711", "numeroFactura": "F001-00004334", "fechaFacturacion": "2025-09-24"
  },

    {
    "numeroGuia": "EG03-5730", "numeroFactura": "F001-00004335", "fechaFacturacion": "2025-09-24"
  },

      {
    "numeroGuia": "EG03-5734", "numeroFactura": "F001-00004336", "fechaFacturacion": "2025-09-24"
  },







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
