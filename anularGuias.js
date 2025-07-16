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

//"EG03-4879",
//"EG03-4903",
//"EG03-4902",
//"EG03-4839",
//"EG03-4834",
//"EG03-4829",
//"EG03-4811",
//"EG03-4806",
//"EG03-4879",
//"EG03-4823",
//"EG03-4920",
//"EG03-4932",
//"EG03-4930",
//"EG03-4933",
//"EG03-4853",
//"EG03-4941",
//"EG03-4940",


//"G010-1411",
//"G010-1402",
//"G010-1401",


const guiasAAnular = [



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
