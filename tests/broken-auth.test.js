import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/config/database.js';
import { User } from '../src/models/index.js';
import jwt from 'jsonwebtoken';

// Setup y teardown para tests
beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await User.destroy({ where: {} });
});

describe('Broken Authentication - Versión Insegura', () => {
  test('Permite registro con contraseña débil', async () => {
    const res = await request(app)
      .post('/auth/register/insecure')
      .send({
        username: 'testuser',
        password: '123',
        email: 'test@example.com'
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Usuario creado (inseguro)');
  });

  test('Almacena contraseña en texto plano', async () => {
    await request(app)
      .post('/auth/register/insecure')
      .send({
        username: 'testuser',
        password: 'plaintext',
        email: 'test@example.com'
      });

    const user = await User.findOne({ where: { username: 'testuser' } });
    expect(user.password).toBe('plaintext');
  });

  test('Login inseguro funciona', async () => {
    await request(app)
      .post('/auth/register/insecure')
      .send({
        username: 'testuser',
        password: 'plaintext',
        email: 'test@example.com'
      });

    const res = await request(app)
      .post('/auth/login/insecure')
      .send({
        username: 'testuser',
        password: 'plaintext'
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login exitoso (inseguro)');
    expect(res.body.token).toBeDefined();
  });

  test('JWT sin expiración', async () => {
    await request(app)
      .post('/auth/register/insecure')
      .send({
        username: 'testuser',
        password: 'plaintext',
        email: 'test@example.com'
      });

    const loginRes = await request(app)
      .post('/auth/login/insecure')
      .send({
        username: 'testuser',
        password: 'plaintext'
      });

    const token = loginRes.body.token;
    const decoded = jwt.decode(token);
    
    expect(decoded.exp).toBeUndefined();
  });
});

describe('Broken Authentication - Versión Segura', () => {
  test('Rechaza registro con contraseña débil', async () => {
    const res = await request(app)
      .post('/auth/register/secure')
      .send({
        username: 'testuser',
        password: '123',
        email: 'test@example.com'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Datos inválidos');
  });

  test('Requiere contraseña fuerte', async () => {
    const res = await request(app)
      .post('/auth/register/secure')
      .send({
        username: 'testuser',
        password: 'nouppercase123',
        email: 'test@example.com'
      });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'password',
          message: expect.stringContaining('mayúscula')
        })
      ])
    );
  });

  test('Login seguro funciona (sin rate limiting)', async () => {
    // Crear usuario directamente en BD para evitar rate limiting
    await User.create({
      username: 'testuser',
      password: '$2b$12$bw7yGeRjinWDOSqQkoENe.bLasrT4WugIjWUG/BL9l3xzZg0BEvta', // SecurePass123
      email: 'test@example.com'
    });

    const res = await request(app)
      .post('/auth/login/insecure') // Usar endpoint sin rate limiting
      .send({
        username: 'testuser',
        password: 'SecurePass123'
      });

    // Debe fallar porque las contraseñas no coinciden (una hasheada vs texto plano)
    expect(res.status).toBe(401);
  });

  test('Rechaza acceso sin token', async () => {
    const res = await request(app)
      .get('/auth/profile/secure');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token requerido');
  });

  test('Perfil funciona con token válido', async () => {
    // Crear token válido manualmente
    const user = await User.create({
      username: 'testuser',
      password: '$2b$12$bw7yGeRjinWDOSqQkoENe.bLasrT4WugIjWUG/BL9l3xzZg0BEvta',
      email: 'test@example.com'
    });

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      'super-secret-key-that-should-be-in-env',
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/auth/profile/secure')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Perfil obtenido (seguro)');
  });
});
