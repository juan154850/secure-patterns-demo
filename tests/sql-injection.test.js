import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/config/database.js';
import { User } from '../src/models/user.js';

// Setup y teardown para tests
beforeAll(async () => {
  await sequelize.authenticate();
  await User.sync({ force: true }); // Recrear tabla para tests
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await User.destroy({ where: {} }); // Limpiar datos entre tests
  
  // Crear usuarios de prueba para los tests de SQL injection
  await User.bulkCreate([
    { username: 'user1', password: 'pass1', email: 'user1@example.com' },
    { username: 'user2', password: 'pass2', email: 'user2@example.com' },
    { username: 'user3', password: 'pass3', email: 'user3@example.com' }
  ]);
});

test('SQLi insegura devuelve múltiples usuarios', async () => {
  const exploit = '1 OR 1=1';
  const res = await request(app).get(`/sql/insecure?id=${exploit}`);
  
  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThan(1); // Debe devolver múltiples usuarios
});

test('Ruta segura bloquea inyección', async () => {
  const exploit = '1 OR 1=1';
  const res = await request(app).get(`/sql/secure?id=${exploit}`);
  
  expect(res.status).toBe(400);  // porque la validación debe fallar
  expect(res.body).toHaveProperty('error', 'Parámetros inválidos');
});

test('Ruta segura funciona con ID válido', async () => {
  const res = await request(app).get('/sql/secure?id=1');
  
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  if (res.body.length > 0) {
    expect(res.body[0]).toHaveProperty('username', 'user1');
  }
});

test('Ruta insegura funciona con ID válido', async () => {
  const res = await request(app).get('/sql/insecure?id=1');
  
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  if (res.body.length > 0) {
    expect(res.body[0]).toHaveProperty('username', 'user1');
  }
});
