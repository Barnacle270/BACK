// anularGuias.js
import mongoose from 'mongoose';

// Reemplaza con tu URI real si no es local
const MONGO_URI = 'mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ';

// Reemplaza con tu esquema real si lo tienes definido en otro archivo
const servicioSchema = new mongoose.Schema({
  numeroGuia: String,
  estado: String,
});

const Servicio = mongoose.model('Servicio', servicioSchema);


const guiasAAnular = [
  "EG03-5482",
  "EG03-5484",
  "EG03-5488",
  "EG03-5492",
  "EG03-5493",
  "EG03-5512",
  "EG03-5517",
  "EG03-5527",

];

async function anularGuias() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    const result = await Servicio.updateMany(
      { numeroGuia: { $in: guiasAAnular } },
      { $set: { estado: 'ANULADA' } }
    );

    console.log(`✅ Guías anuladas correctamente: ${result.modifiedCount}`);
  } catch (err) {
    console.error('❌ Error al anular guías:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Conexión cerrada');
  }
}

anularGuias();
