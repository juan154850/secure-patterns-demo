import { User, Document, setupAssociations } from '../models/index.js';

export const initModels = async () => {
  // Configurar asociaciones primero
  setupAssociations();
  
  // ⚠️ ESTA LÍNEA ES SOLO PARA DEMO (equivale a CREATE TABLE IF NOT EXISTS)
  // Sincronizar en orden: primero User, luego Document (por la foreign key)
  await User.sync();
  await Document.sync();
};
