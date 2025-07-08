import 'dotenv/config'; // ✅ Más limpio con ESM, sin necesidad de importar dotenv directamente
import app from './app.js';
import { connectDB } from './db.js';

const PORT = process.env.PORT || 4000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
