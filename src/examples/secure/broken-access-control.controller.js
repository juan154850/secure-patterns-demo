import { Document, User } from '../../models/index.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-that-should-be-in-env';

// Helper para obtener usuario del token (seguro)
const getUserFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

// Acceso a documento con validación de propietario
export const getDocumentSecure = async (req, res) => {
  try {
    const { id } = req.params;
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // Valida que el documento pertenezca al usuario autenticado
    const document = await Document.findOne({
      where: { 
        id,
        userId: user.userId // Solo documentos del usuario autenticado
      },
      include: [{ model: User, attributes: ['username'] }]
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado o sin permisos' });
    }

    res.json({
      message: 'Documento obtenido (seguro)',
      document: {
        id: document.id,
        title: document.title,
        content: document.content,
        owner: document.User.username,
        isPrivate: document.isPrivate
      }
    });
  } catch {
    res.status(500).json({ error: 'Error al obtener documento' });
  }
};

// Listado de documentos filtrado por usuario
export const getDocumentsSecure = async (req, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // Solo obtiene documentos del usuario autenticado
    const documents = await Document.findAll({
      where: { userId: user.userId },
      include: [{ model: User, attributes: ['username'] }]
    });

    res.json({
      message: 'Documentos obtenidos (seguro)',
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        owner: doc.User.username,
        isPrivate: doc.isPrivate
      }))
    });
  } catch {
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
};

// Actualizar documento con validación de propietario
export const updateDocumentSecure = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // Solo encuentra documentos del usuario autenticado
    const document = await Document.findOne({
      where: { 
        id,
        userId: user.userId
      }
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado o sin permisos' });
    }

    await document.update({ title, content });

    res.json({
      message: 'Documento actualizado (seguro)',
      document: {
        id: document.id,
        title: document.title,
        content: document.content
      }
    });
  } catch {
    res.status(500).json({ error: 'Error al actualizar documento' });
  }
};

// Eliminar documento con validación de propietario
export const deleteDocumentSecure = async (req, res) => {
  try {
    const { id } = req.params;
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // Solo encuentra documentos del usuario autenticado
    const document = await Document.findOne({
      where: { 
        id,
        userId: user.userId
      }
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado o sin permisos' });
    }

    await document.destroy();

    res.json({
      message: 'Documento eliminado (seguro)',
      documentId: id
    });
  } catch {
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
};

// Crear documento con validación de autenticación
export const createDocumentSecure = async (req, res) => {
  try {
    const { title, content, isPrivate = true } = req.body;
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const document = await Document.create({
      title,
      content,
      userId: user.userId,
      isPrivate
    });

    res.status(201).json({
      message: 'Documento creado (seguro)',
      document: {
        id: document.id,
        title: document.title,
        content: document.content,
        userId: document.userId,
        isPrivate: document.isPrivate
      }
    });
  } catch {
    res.status(500).json({ error: 'Error al crear documento' });
  }
};
