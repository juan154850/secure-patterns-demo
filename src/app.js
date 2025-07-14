import express from 'express';
import helmet from 'helmet';
import { setupCsrf } from './middlewares/csrf-protection.middleware.js';
import csrfRouter from './routes/csrf.js';
import pingRouter from './routes/ping.js';
import sqlInjectionRouter from './routes/sql-injection.js';
import xssRouter from './routes/xss.js';
import brokenAuthRouter from './routes/broken-auth.js';

const app = express();

// ────── Middlewares globales ──────
app.use(helmet());
app.use(express.json());
setupCsrf(app);

// ────── Routes ──────

app.use('/ping', pingRouter);
app.use('/sql', sqlInjectionRouter);
app.use('/xss', xssRouter);
app.use('/csrf', csrfRouter);
app.use('/auth', brokenAuthRouter);

export default app;
