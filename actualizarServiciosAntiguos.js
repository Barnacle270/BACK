import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // ajusta la ruta si es necesario

const actualizarServiciosAntiguos = async () => {
  try {
    await mongoose.connect('mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'); // Cambia por tu URI real

    const resultado = await Servicio.updateMany(
      { estadoFacturacion: { $exists: false } },
      {
        $set: {
          estadoFacturacion: null,
          fechaRecepcion: null,
          fechaFacturacion: null,
          numeroFactura: null
        }
      }
    );

    console.log(`Servicios actualizados: ${resultado.modifiedCount}`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error actualizando servicios antiguos:', error);
  }
};

actualizarServiciosAntiguos();
