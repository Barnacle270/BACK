import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real




// 2. Lista de guías con datos de facturación
const facturas = [


{ numeroGuia: 'EG03-4837', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4840', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4841', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4842', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4843', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4844', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4845', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4850', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4851', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4852', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4889', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4895', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4896', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4897', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4898', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4899', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4900', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4836', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4835', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4887', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4886', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4883', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4881', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4882', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4878', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4877', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4875', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4876', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4874', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4873', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4872', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4871', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4870', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4866', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4864', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4862', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4891', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4906', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4913', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4914', numeroFactura: 'E001-6867', fechaFacturacion: '2025-07-11' }

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
