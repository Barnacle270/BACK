import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import auth2Routes from './routes/auth2.routes.js';
import boletasRoutes from './routes/boletas.routes.js';
import servicioRoutes from './routes/servicio.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import conductorRoutes from './routes/conductor.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import maquinariaRoutes from './routes/maquinaria.routes.js';
import lecturaRoutes from './routes/lectura.routes.js';
import mantenimientoRoutes from './routes/mantenimiento.routes.js';

const app = express();

// 🆕 si usas cookies con `secure: true` detrás de Render (proxy), habilita esto
app.set('trust proxy', 1); // req.secure será correcto detrás de proxy

// Configuración de CORS
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

// 🆕 endpoint de salud ultra-liviano (para “wake-up” y monitoreo)
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// (opcional) ping rápido en raíz para pruebas manuales
app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api', auth2Routes);
app.use('/api', boletasRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', clienteRoutes);
app.use('/api', conductorRoutes);
app.use('/api/maquinarias', maquinariaRoutes);
app.use('/api/lecturas', lecturaRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);

// Ruta fallback para errores
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
