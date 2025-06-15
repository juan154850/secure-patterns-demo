import app from './app.js';
import { sequelize } from './config/database.js';
import { initModels } from './database/init-db.js';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await initModels();
    app.listen(PORT, () => {
      console.log(`API corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('⛔ Error al iniciar la API:', err);
    process.exit(1);
  }
})();
