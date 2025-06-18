import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import auth2Routes from './routes/auth2.routes.js';
import boletasRoutes from './routes/boletas.routes.js';
import cashRoutes from './routes/cash.routes.js';


const app = express();

// Configuración de CORS dinámica basada en entorno
const allowedOrigins = [
  'http://localhost:5173',
  'https://administrativo.transportej.com',
  'http://administrativo.transportej.com',
  'https://backendtjboletas.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api', auth2Routes);
app.use('/api', boletasRoutes);
app.use('/api/caja', cashRoutes);
app.use('/pdfs', express.static('src/pdfs')); // expone los PDF





// Ruta fallback para errores
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
