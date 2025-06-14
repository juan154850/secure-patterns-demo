import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(96), // almacenará hash posteriormente
    allowNull: false,
  },
});
