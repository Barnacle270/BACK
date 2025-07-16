import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta ruta si es diferente

// 1. Conexión
await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Reemplaza con tu URI real

// 2. Lista de guías con datos de facturación
const facturas = [

  { numeroGuia: 'EG03-4764', numeroFactura: 'E001-00003954', fechaFacturacion: '2025-07-03' },
{ numeroGuia: 'EG03-4765', numeroFactura: 'E001-00003953', fechaFacturacion: '2025-07-03' },
{ numeroGuia: 'EG03-4767', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4768', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4769', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4770', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4771', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4772', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4773', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4774', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4775', numeroFactura: 'E001-00003977', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4776', numeroFactura: 'E001-00003977', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4777', numeroFactura: 'E001-00003977', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4778', numeroFactura: 'E001-00003977', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4783', numeroFactura: 'E001-00003980', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4784', numeroFactura: 'E001-00003999', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4785', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4786', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4787', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4788', numeroFactura: 'E001-00004000', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4789', numeroFactura: 'E001-00004000', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4791', numeroFactura: 'E001-00003965', fechaFacturacion: '2025-07-04' },
{ numeroGuia: 'EG03-4792', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4793', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4794', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4795', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4796', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4797', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4798', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4799', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4800', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4801', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4802', numeroFactura: 'E001-00003964', fechaFacturacion: '2025-07-04' },
{ numeroGuia: 'EG03-4803', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4805', numeroFactura: 'E001-00003971', fechaFacturacion: '2025-07-05' },
{ numeroGuia: 'EG03-4808', numeroFactura: 'E001-00003987', fechaFacturacion: '2025-07-09' },
{ numeroGuia: 'EG03-4809', numeroFactura: 'E001-00003987', fechaFacturacion: '2025-07-09' },
{ numeroGuia: 'EG03-4810', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4812', numeroFactura: 'E001-00003978', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4813', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4814', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4816', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4817', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4818', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4819', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4820', numeroFactura: 'E001-00003975', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4821', numeroFactura: 'E001-00003976', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4822', numeroFactura: 'E001-00003979', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4824', numeroFactura: 'E001-00003973', fechaFacturacion: '2025-07-05' },
{ numeroGuia: 'EG03-4826', numeroFactura: 'E001-00003981', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4827', numeroFactura: 'E001-00003981', fechaFacturacion: '2025-07-07' },
{ numeroGuia: 'EG03-4830', numeroFactura: 'E001-00003987', fechaFacturacion: '2025-07-09' },
{ numeroGuia: 'EG03-4838', numeroFactura: 'E001-00003984', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4847', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4848', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4849', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4854', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4855', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4856', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4857', numeroFactura: 'E001-00003983', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4858', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4859', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4860', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4861', numeroFactura: 'E001-00003985', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4863', numeroFactura: 'E001-00003983', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4865', numeroFactura: 'E001-00003983', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4867', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4868', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4869', numeroFactura: 'E001-00003982', fechaFacturacion: '2025-07-08' },
{ numeroGuia: 'EG03-4885', numeroFactura: 'E001-00003988', fechaFacturacion: '2025-07-10' },
{ numeroGuia: 'EG03-4890', numeroFactura: 'E001-00003994', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4892', numeroFactura: 'E001-00003993', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4893', numeroFactura: 'E001-00003993', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4894', numeroFactura: 'E001-00003993', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4904', numeroFactura: 'E001-00003995', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4907', numeroFactura: 'E001-00003996', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4908', numeroFactura: 'E001-00003996', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4909', numeroFactura: 'E001-00003996', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'EG03-4910', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4911', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4912', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4915', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4916', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4918', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4919', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4921', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4922', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4923', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4924', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4925', numeroFactura: 'E001-00004005', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4926', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4927', numeroFactura: 'E001-00004001', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4928', numeroFactura: 'E001-00004004', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4929', numeroFactura: 'E001-00004004', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4931', numeroFactura: 'E001-00004002', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4934', numeroFactura: 'E001-00004006', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4935', numeroFactura: 'E001-00004004', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4936', numeroFactura: 'E001-00004004', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'EG03-4938', numeroFactura: 'E001-00004003', fechaFacturacion: '2025-07-14' },
{ numeroGuia: 'G010-1290', numeroFactura: 'E001-00003963', fechaFacturacion: '2025-07-04' },
{ numeroGuia: 'G010-1382', numeroFactura: 'E001-00003958', fechaFacturacion: '2025-07-03' },
{ numeroGuia: 'G010-1383', numeroFactura: 'E001-00003958', fechaFacturacion: '2025-07-03' },
{ numeroGuia: 'G010-1384', numeroFactura: 'E001-00003958', fechaFacturacion: '2025-07-03' },
{ numeroGuia: 'G010-1385', numeroFactura: 'E001-00003958', fechaFacturacion: '2025-07-03' },
{ numeroGuia: 'G010-1386', numeroFactura: 'E001-00003958', fechaFacturacion: '2025-07-03' },
{ numeroGuia: 'G010-1387', numeroFactura: 'E001-00003958', fechaFacturacion: '2025-07-03' },
{ numeroGuia: 'G010-1388', numeroFactura: 'E001-00003962', fechaFacturacion: '2025-07-04' },
{ numeroGuia: 'G010-1390', numeroFactura: 'E001-00003992', fechaFacturacion: '2025-07-10' },
{ numeroGuia: 'G010-1391', numeroFactura: 'E001-00003986', fechaFacturacion: '2025-07-09' },
{ numeroGuia: 'G010-1392', numeroFactura: 'E001-00003986', fechaFacturacion: '2025-07-09' },
{ numeroGuia: 'G010-1393', numeroFactura: 'E001-00003986', fechaFacturacion: '2025-07-09' },
{ numeroGuia: 'G010-1394', numeroFactura: 'E001-00003986', fechaFacturacion: '2025-07-09' },
{ numeroGuia: 'G010-1395', numeroFactura: 'E001-00003997', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'G010-1396', numeroFactura: 'E001-00003997', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'G010-1397', numeroFactura: 'E001-00003997', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'G010-1400', numeroFactura: 'E001-00003997', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'G010-1405', numeroFactura: 'E001-00003997', fechaFacturacion: '2025-07-11' },
{ numeroGuia: 'G010-1406', numeroFactura: 'E001-00003997', fechaFacturacion: '2025-07-11' },
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
