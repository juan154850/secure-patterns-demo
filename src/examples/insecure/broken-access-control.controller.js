import { Document, User } from '../../models/index.js';
import jwt from 'jsonwebtoken';

// Helper para obtener usuario del token (inseguro)
const getUserFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, 'secret123');
  } catch {
    return null;
  }
};

// Acceso directo a documento por ID sin validar propietario
export const getDocumentInsecure = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtiene cualquier documento sin validar si pertenece al usuario
    const document = await Document.findByPk(id, {
      include: [{ model: User, attributes: ['username'] }]
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    res.json({
      message: 'Documento obtenido (inseguro)',
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

// Listado de documentos sin filtrar por usuario
export const getDocumentsInsecure = async (req, res) => {
  try {
    // Obtiene TODOS los documentos sin filtrar por usuario
    const documents = await Document.findAll({
      include: [{ model: User, attributes: ['username'] }]
    });

    res.json({
      message: 'Documentos obtenidos (inseguro)',
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

// Actualizar documento sin validar propietario
export const updateDocumentInsecure = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Actualiza cualquier documento sin validar propietario
    const document = await Document.findByPk(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    await document.update({ title, content });

    res.json({
      message: 'Documento actualizado (inseguro)',
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

// Eliminar documento sin validar propietario
export const deleteDocumentInsecure = async (req, res) => {
  try {
    const { id } = req.params;

    // Elimina cualquier documento sin validar propietario
    const document = await Document.findByPk(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    await document.destroy();

    res.json({
      message: 'Documento eliminado (inseguro)',
      documentId: id
    });
  } catch {
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
};

// Crear documento (necesita autenticación básica)
export const createDocumentInsecure = async (req, res) => {
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
      message: 'Documento creado (inseguro)',
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
