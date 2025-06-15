import express from 'express';
import helmet from 'helmet';
import pingRouter from './routes/ping.js';
import sqlInjectionRouter from './routes/sql-injection.js';
import xssRouter from './routes/xss.js';

const app = express();

// ────── Middlewares globales ──────
app.use(helmet());
app.use(express.json());

// ────── Routes ──────
app.use('/ping', pingRouter);
app.use('/sql', sqlInjectionRouter);
app.use('/xss', xssRouter);

export default app;
