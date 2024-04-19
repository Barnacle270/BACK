import express from 'express';
import morgan from 'morgan';
import auth2Routes from './routes/auth2.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import boletasRoutes from './routes/boletas.routes.js';
import reportmaqRoutes from './routes/reportmaq.routes.js';

const app = express();

app.use(cors({
  origin: 'https://boletas.transportej.com',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


app.use('/api',auth2Routes);
app.use('/api',boletasRoutes);
app.use('/api',reportmaqRoutes);



export default app;