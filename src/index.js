import express from 'express';
import helmet from 'helmet';
import { sequelize } from './config/database.js';
import { initModels } from './database/init-db.js';
import pingRouter from './routes/ping.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ────── Middlewares globales ──────
app.use(helmet());        // cabeceras de seguridad
app.use(express.json());  // parsea JSON en petición

// ────── Routes ──────
app.use('/ping', pingRouter);

// ────── Arranque ──────
(async () => {
  try {
    await sequelize.authenticate();
    await initModels();          // crea tablas si no existen
    app.listen(PORT, () =>
      console.log(`API corriendo en http://localhost:${PORT}`),
    );
  } catch (err) {
    console.error('⛔ Error al iniciar la API:', err);
    process.exit(1);
  }
})();
