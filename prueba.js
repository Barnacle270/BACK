// removeNumeroControlIndex.mjs
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ';

async function removeIndex() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    const collection = mongoose.connection.collection('maquinarias');

    const indexes = await collection.indexes();
    const targetIndex = indexes.find(index => index.name === 'numeroControl_1');

    if (targetIndex) {
      await collection.dropIndex('numeroControl_1');
      console.log('🗑️ Índice "numeroControl_1" eliminado correctamente.');
    } else {
      console.log('ℹ️ Índice "numeroControl_1" no existe. Nada que eliminar.');
    }

    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error al eliminar el índice:', error);
  }
}

removeIndex();
