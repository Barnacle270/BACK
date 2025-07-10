import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real

// 2. Lista de guías con datos de facturación
const facturas = [
  { numeroGuia: 'EG03-4764', numeroFactura: 'F001-00003954', fechaFacturacion: '2025-07-04' },
  { numeroGuia: 'EG03-4765', numeroFactura: 'F001-00003953', fechaFacturacion: '2025-07-05' },
  { numeroGuia: 'EG03-4767', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-05' },
  { numeroGuia: 'EG03-4768', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4769', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4770', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4771', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4772', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4773', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4774', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4775', numeroFactura: 'F001-00003977', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4776', numeroFactura: 'F001-00003977', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4777', numeroFactura: 'F001-00003977', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4778', numeroFactura: 'F001-00003977', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4783', numeroFactura: 'F001-00003980', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4785', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4786', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4787', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4791', numeroFactura: 'F001-00003965', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4792', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4793', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4794', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4795', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4796', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4797', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4798', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4799', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4800', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4801', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4802', numeroFactura: 'F001-00003964', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4803', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4805', numeroFactura: 'F001-00003971', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4808', numeroFactura: 'F001-00003987', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4809', numeroFactura: 'F001-00003987', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4810', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4812', numeroFactura: 'F001-00003978', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4813', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4814', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4816', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4817', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4818', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4819', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4820', numeroFactura: 'F001-00003975', fechaFacturacion: '2025-07-07' },
  { numeroGuia: 'EG03-4821', numeroFactura: 'F001-00003976', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4822', numeroFactura: 'F001-00003979', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4824', numeroFactura: 'F001-00003973', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4826', numeroFactura: 'F001-00003981', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4827', numeroFactura: 'F001-00003981', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4830', numeroFactura: 'F001-00003987', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4838', numeroFactura: 'F001-00003984', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4847', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4848', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4849', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4854', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4855', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4856', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4857', numeroFactura: 'F001-00003983', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4858', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4859', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4860', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-08' },
  { numeroGuia: 'EG03-4861', numeroFactura: 'F001-00003985', fechaFacturacion: '2025-07-09' },
  { numeroGuia: 'EG03-4863', numeroFactura: 'F001-00003983', fechaFacturacion: '2025-07-09' },
  { numeroGuia: 'EG03-4865', numeroFactura: 'F001-00003983', fechaFacturacion: '2025-07-09' },
  { numeroGuia: 'EG03-4867', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-09' },
  { numeroGuia: 'EG03-4868', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-09' },
  { numeroGuia: 'EG03-4869', numeroFactura: 'F001-00003982', fechaFacturacion: '2025-07-09' },
  { numeroGuia: 'EG03-4885', numeroFactura: 'F001-00003988', fechaFacturacion: '2025-07-09' },
  { numeroGuia: 'G010-1391', numeroFactura: 'F001-00003986', fechaFacturacion: '2025-07-10' },
  { numeroGuia: 'G010-1392', numeroFactura: 'F001-00003986', fechaFacturacion: '2025-07-10' },
  { numeroGuia: 'G010-1393', numeroFactura: 'F001-00003986', fechaFacturacion: '2025-07-10' },
  { numeroGuia: 'G010-1394', numeroFactura: 'F001-00003986', fechaFacturacion: '2025-07-10' }

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
