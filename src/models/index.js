import { User } from './user.js';
import { Document } from './document.js';

// Definir todas las asociaciones aquí para evitar dependencias circulares
export const setupAssociations = () => {
  // Un usuario puede tener muchos documentos
  User.hasMany(Document, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE' // Eliminar documentos cuando se elimine el usuario
  });

  // Un documento pertenece a un usuario
  Document.belongsTo(User, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE' 
  });
};

export { User, Document };
