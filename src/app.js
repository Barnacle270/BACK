import express from 'express';
import morgan from 'morgan';
import auth2Routes from './routes/auth2.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import boletasRoutes from './routes/boletas.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


app.use('/api',auth2Routes);
app.use('/api',boletasRoutes);



export default app;