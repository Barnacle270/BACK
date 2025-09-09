import 'dotenv/config';
import app from './app.js';
import { connectDB } from './db.js';

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDB(); // espera a que la DB esté lista
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
    process.exit(1); // si falla al iniciar, Render lo reinicia
  }
}

startServer();
