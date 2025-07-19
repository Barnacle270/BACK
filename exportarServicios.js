// exportarServicios.js
import mongoose from 'mongoose';
import Servicio from './src/models/servicio.model.js';
import fs from 'fs';

const URI = 'mongodb+srv://Jhostym:22314121@clustertj.wr8smgz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTJ';

async function exportarServicios() {
  try {
    await mongoose.connect(URI);
    const servicios = await Servicio.find({});
    fs.writeFileSync('servicios.json', JSON.stringify(servicios, null, 2));
    console.log('Exportado a servicios.json');
    process.exit(0);
  } catch (err) {
    console.error('Error exportando:', err);
    process.exit(1);
  }
}

exportarServicios();
