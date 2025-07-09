// actualizarCargaSuelta.js
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ'; // 🔁 Cambia a tu URI real

const servicioSchema = new mongoose.Schema({
  numeroContenedor: String,
  estado: String,
  tipoCarga: String,
});

const Servicio = mongoose.model('Servicio', servicioSchema);

async function actualizarCargaSuelta() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Conectado a MongoDB');

    const resultado = await Servicio.updateMany(
      { numeroContenedor: { $regex: /^carga suelta$/i } },
      {
        $set: {
          estado: 'CONCLUIDO',
          tipoCarga: 'CARGA SUELTA',
        },
      }
    );

    console.log(`✅ Documentos actualizados: ${resultado.modifiedCount}`);
  } catch (error) {
    console.error('❌ Error al actualizar:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

actualizarCargaSuelta();
