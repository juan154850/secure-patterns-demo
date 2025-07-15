import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
});

// Las asociaciones se definen en un archivo separado para evitar dependencias circulares
