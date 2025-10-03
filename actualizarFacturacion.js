import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real

// 2. Lista de guías con datos de facturación
const facturas =
[
  { "numeroGuia": "EG03-5734", "numeroFactura": "F001-00004336", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5731", "numeroFactura": "F001-00004337", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5724", "numeroFactura": "F001-00004337", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5737", "numeroFactura": "F001-00004337", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5732", "numeroFactura": "F001-00004337", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5748", "numeroFactura": "F001-00004337", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5714", "numeroFactura": "F001-00004338", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5733", "numeroFactura": "F001-00004339", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5723", "numeroFactura": "F001-00004340", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5741", "numeroFactura": "F001-00004341", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5717", "numeroFactura": "F001-00004342", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5749", "numeroFactura": "F001-00004342", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5761", "numeroFactura": "F001-00004342", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5745", "numeroFactura": "F001-00004343", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5744", "numeroFactura": "F001-00004343", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5743", "numeroFactura": "F001-00004343", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5742", "numeroFactura": "F001-00004343", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5738", "numeroFactura": "F001-00004343", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5772", "numeroFactura": "F001-00004343", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5763", "numeroFactura": "F001-00004344", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5696", "numeroFactura": "F001-00004345", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5695", "numeroFactura": "F001-00004345", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5694", "numeroFactura": "F001-00004346", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5692", "numeroFactura": "F001-00004347", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5693", "numeroFactura": "F001-00004348", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5707", "numeroFactura": "F001-00004349", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5709", "numeroFactura": "F001-00004350", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5710", "numeroFactura": "F001-00004350", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5720", "numeroFactura": "F001-00004351", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5755", "numeroFactura": "F001-00004352", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5756", "numeroFactura": "F001-00004352", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5765", "numeroFactura": "F001-00004353", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5786", "numeroFactura": "F001-00004354", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5785", "numeroFactura": "F001-00004355", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5797", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5796", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5795", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5794", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5792", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5789", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5799", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5788", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5790", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5791", "numeroFactura": "F001-00004356", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5798", "numeroFactura": "F001-00004357", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5804", "numeroFactura": "F001-00004358", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5803", "numeroFactura": "F001-00004359", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5800", "numeroFactura": "F001-00004361", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5817", "numeroFactura": "F001-00004362", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5739", "numeroFactura": "F001-00004363", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5811", "numeroFactura": "F001-00004363", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5662", "numeroFactura": "F001-00004364", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5663", "numeroFactura": "F001-00004364", "fechaFacturacion": "2025-10-02" },
  { "numeroGuia": "EG03-5664", "numeroFactura": "F001-00004364", "fechaFacturacion": "2025-10-02" }
]

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
