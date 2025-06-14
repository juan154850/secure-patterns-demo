import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'mysql',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'secure_demo',
  logging: false,
  define: { timestamps: false },
});
