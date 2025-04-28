import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import auth2Routes from './routes/auth2.routes.js';
import boletasRoutes from './routes/boletas.routes.js';
import transporteRoutes from './routes/transporte.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import camionesRoutes from './routes/camiones.routes.js';
import conductorRoutes from './routes/conductor.routes.js';

const app = express();

// Configuración de CORS dinámica basada en entorno
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://administrativo.transportej.com']  // Tu dominio en producción
  : ['http://localhost:5173'];                   // Local

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
app.use('/api', transporteRoutes);
app.use('/api', clienteRoutes);
app.use('/api', camionesRoutes);
app.use('/api', conductorRoutes);

// Ruta fallback para errores
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
