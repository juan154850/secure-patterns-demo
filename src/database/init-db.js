import { User } from '../models/User.js';

export const initModels = async () => {
  // ⚠️ ESTA LÍNEA ES SOLO PARA DEMO (equivale a CREATE TABLE IF NOT EXISTS)
  await User.sync();
};
