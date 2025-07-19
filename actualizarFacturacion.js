import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real

// 2. Lista de guías con datos de facturación
const facturas = [

{ numeroGuia: 'EG03-4996', numeroFactura: 'F001-00004013', fechaFacturacion: '2025-07-16' },
{ numeroGuia: 'EG03-4945', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4946', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4947', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4948', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4949', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4951', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4952', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4953', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4954', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4955', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4956', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4957', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4971', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4972', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4973', numeroFactura: 'F001-00004014', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4967', numeroFactura: 'F001-00004015', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4974', numeroFactura: 'F001-00004016', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4975', numeroFactura: 'F001-00004016', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4993', numeroFactura: 'F001-00004018', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4994', numeroFactura: 'F001-00004018', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4998', numeroFactura: 'F001-00004018', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4999', numeroFactura: 'F001-00004018', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-5000', numeroFactura: 'F001-00004018', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-5001', numeroFactura: 'F001-00004018', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-5002', numeroFactura: 'F001-00004018', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4979', numeroFactura: 'F001-00004019', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4980', numeroFactura: 'F001-00004019', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4981', numeroFactura: 'F001-00004019', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4985', numeroFactura: 'F001-00004019', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4986', numeroFactura: 'F001-00004019', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4987', numeroFactura: 'F001-00004019', fechaFacturacion: '2025-07-17' },
{ numeroGuia: 'EG03-4962', numeroFactura: 'F001-00004020', fechaFacturacion: '2025-07-18' },
{ numeroGuia: 'EG03-5016', numeroFactura: 'F001-00004021', fechaFacturacion: '2025-07-18' },
{ numeroGuia: 'EG03-5010', numeroFactura: 'F001-00004022', fechaFacturacion: '2025-07-18' },
{ numeroGuia: 'EG03-5011', numeroFactura: 'F001-00004022', fechaFacturacion: '2025-07-18' },
{ numeroGuia: 'EG03-4995', numeroFactura: 'F001-00004023', fechaFacturacion: '2025-07-18' },


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
