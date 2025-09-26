import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
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
import googleSheetsRoutes from './routes/googleSheets.routes.js';

const app = express();

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🆕 si usas cookies con `secure: true` detrás de Render (proxy), habilita esto
app.set('trust proxy', 1); // req.secure será correcto detrás de proxy

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://administrativo.transportej.com',
  'http://administrativo.transportej.com',
  'https://back-2vwn.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// 🆕 servir archivos estáticos (ej. index.html en public/)
app.use(express.static(path.join(__dirname, 'public')));

// 🆕 endpoint de salud ultra-liviano (para “wake-up” y monitoreo)
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Rutas de la API
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

app.use("/api/sheets", googleSheetsRoutes);

// Ruta fallback para errores 404 en la API
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
