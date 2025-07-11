import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js'; // Ajusta esta ruta si está en otro directorio

const MONGO_URI = 'mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'; // Cambia esto por tu URI real

async function corregirTipoGuiaFaltante() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const servicios = await Servicio.find({
      $or: [
        { tipoGuia: { $exists: false } },
        { tipoGuia: null }
      ]
    });

    console.log(`🔍 Encontrados ${servicios.length} servicios sin tipoGuia`);

    for (const servicio of servicios) {
      const { numeroGuia } = servicio;

      if (!numeroGuia) {
        console.warn(`⚠️ Servicio sin numeroGuia, ID: ${servicio._id}`);
        continue;
      }

      let nuevoTipo = null;

      if (numeroGuia.startsWith('EG03')) {
        nuevoTipo = 'NORMAL';
      } else if (numeroGuia.startsWith('G010')) {
        nuevoTipo = 'ESPECIAL';
      }

      if (!nuevoTipo) {
        console.warn(`⚠️ No se pudo inferir tipoGuia para ${numeroGuia}`);
        continue;
      }

      servicio.tipoGuia = nuevoTipo;
      await servicio.save();
      console.log(`✅ tipoGuia corregido a '${nuevoTipo}' para ${numeroGuia}`);
    }

    console.log('🎉 Corrección completada.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el script:', error.message);
    process.exit(1);
  }
}

corregirTipoGuiaFaltante();
