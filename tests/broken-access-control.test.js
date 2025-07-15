import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/config/database.js';
import { User, Document, setupAssociations } from '../src/models/index.js';
import jwt from 'jsonwebtoken';

// Setup y teardown para tests
beforeAll(async () => {
  await sequelize.authenticate();
  setupAssociations();
  
  // Sincronizar modelos sin forzar recreación
  await sequelize.sync({ alter: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Limpiar datos en orden correcto (primero documentos, luego usuarios)
  await Document.destroy({ where: {}, cascade: true });
  await User.destroy({ where: {}, cascade: true });
});

// Helper para crear usuarios y documentos de prueba
const createTestData = async () => {
  const user1 = await User.create({
    username: 'user1',
    password: 'password1',
    email: 'user1@example.com'
  });

  const user2 = await User.create({
    username: 'user2',
    password: 'password2',
    email: 'user2@example.com'
  });

  const doc1 = await Document.create({
    title: 'Documento de User1',
    content: 'Contenido privado de user1',
    userId: user1.id,
    isPrivate: true
  });

  const doc2 = await Document.create({
    title: 'Documento de User2',
    content: 'Contenido privado de user2',
    userId: user2.id,
    isPrivate: true
  });

  return { user1, user2, doc1, doc2 };
};

// Helper para crear token JWT
const createToken = (user, secret = 'secret123') => {
  return jwt.sign(
    { userId: user.id, username: user.username },
    secret
  );
};

const createSecureToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username },
    'super-secret-key-that-should-be-in-env',
    { expiresIn: '1h' }
  );
};

describe('Broken Access Control - Versión Insegura (IDOR)', () => {
  test('Permite acceso a documento de otro usuario', async () => {
    const { user1, doc2 } = await createTestData();
    const token = createToken(user1);

    // User1 intenta acceder al documento de User2
    const res = await request(app)
      .get(`/access/documents/insecure/${doc2.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.document.owner).toBe('user2');
    expect(res.body.document.content).toBe('Contenido privado de user2');
  });

  test('Lista todos los documentos sin filtrar por usuario', async () => {
    const { user1 } = await createTestData();
    const token = createToken(user1);

    const res = await request(app)
      .get('/access/documents/insecure')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.documents.length).toBe(2);
    expect(res.body.documents.some(doc => doc.owner === 'user1')).toBe(true);
    expect(res.body.documents.some(doc => doc.owner === 'user2')).toBe(true);
  });

  test('Permite actualizar documento de otro usuario', async () => {
    const { user1, doc2 } = await createTestData();
    const token = createToken(user1);

    // User1 intenta actualizar el documento de User2
    const res = await request(app)
      .put(`/access/documents/insecure/${doc2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Documento hackeado',
        content: 'Contenido modificado por atacante'
      });

    expect(res.status).toBe(200);
    expect(res.body.document.title).toBe('Documento hackeado');
  });

  test('Permite eliminar documento de otro usuario', async () => {
    const { user1, doc2 } = await createTestData();
    const token = createToken(user1);

    // User1 intenta eliminar el documento de User2
    const res = await request(app)
      .delete(`/access/documents/insecure/${doc2.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Documento eliminado (inseguro)');

    // Verificar que el documento fue eliminado
    const deletedDoc = await Document.findByPk(doc2.id);
    expect(deletedDoc).toBeNull();
  });

  test('Permite crear documento', async () => {
    const { user1 } = await createTestData();
    const token = createToken(user1);

    const res = await request(app)
      .post('/access/documents/insecure')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Nuevo documento',
        content: 'Contenido nuevo',
        isPrivate: true
      });

    expect(res.status).toBe(201);
    expect(res.body.document.title).toBe('Nuevo documento');
    expect(res.body.document.userId).toBe(user1.id);
  });
});

describe('Broken Access Control - Versión Segura', () => {
  test('Rechaza acceso a documento de otro usuario', async () => {
    const { user1, doc2 } = await createTestData();
    const token = createSecureToken(user1);

    // User1 intenta acceder al documento de User2
    const res = await request(app)
      .get(`/access/documents/secure/${doc2.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Documento no encontrado o sin permisos');
  });

  test('Permite acceso a documento propio', async () => {
    const { user1, doc1 } = await createTestData();
    const token = createSecureToken(user1);

    const res = await request(app)
      .get(`/access/documents/secure/${doc1.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.document.owner).toBe('user1');
    expect(res.body.document.content).toBe('Contenido privado de user1');
  });

  test('Lista solo documentos del usuario autenticado', async () => {
    const { user1 } = await createTestData();
    const token = createSecureToken(user1);

    const res = await request(app)
      .get('/access/documents/secure')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.documents.length).toBe(1);
    expect(res.body.documents[0].owner).toBe('user1');
  });

  test('Rechaza actualización de documento de otro usuario', async () => {
    const { user1, doc2 } = await createTestData();
    const token = createSecureToken(user1);

    // User1 intenta actualizar el documento de User2
    const res = await request(app)
      .put(`/access/documents/secure/${doc2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Documento hackeado',
        content: 'Contenido modificado por atacante'
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Documento no encontrado o sin permisos');
  });

  test('Permite actualizar documento propio', async () => {
    const { user1, doc1 } = await createTestData();
    const token = createSecureToken(user1);

    const res = await request(app)
      .put(`/access/documents/secure/${doc1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Documento actualizado',
        content: 'Contenido actualizado'
      });

    expect(res.status).toBe(200);
    expect(res.body.document.title).toBe('Documento actualizado');
  });

  test('Rechaza eliminación de documento de otro usuario', async () => {
    const { user1, doc2 } = await createTestData();
    const token = createSecureToken(user1);

    // User1 intenta eliminar el documento de User2
    const res = await request(app)
      .delete(`/access/documents/secure/${doc2.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Documento no encontrado o sin permisos');

    // Verificar que el documento NO fue eliminado
    const stillExists = await Document.findByPk(doc2.id);
    expect(stillExists).not.toBeNull();
  });

  test('Permite eliminar documento propio', async () => {
    const { user1, doc1 } = await createTestData();
    const token = createSecureToken(user1);

    const res = await request(app)
      .delete(`/access/documents/secure/${doc1.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Documento eliminado (seguro)');

    // Verificar que el documento fue eliminado
    const deletedDoc = await Document.findByPk(doc1.id);
    expect(deletedDoc).toBeNull();
  });

  test('Rechaza acceso sin token', async () => {
    const { doc1 } = await createTestData();

    const res = await request(app)
      .get(`/access/documents/secure/${doc1.id}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token requerido');
  });

  test('Valida formato de ID de documento', async () => {
    const { user1 } = await createTestData();
    const token = createSecureToken(user1);

    const res = await request(app)
      .get('/access/documents/secure/invalid-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Parámetros inválidos');
  });
});
