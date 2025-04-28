import app from './app.js';
import { connectDB } from './db.js';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables del .env

const PORT = process.env.PORT || 4000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});