import request from 'supertest';
import app from '../src/app.js';

test('SQLi insegura devuelve múltiples usuarios', async () => {
  const exploit = '1 OR 1=1';
  const res = await request(app).get(`/sql/insecure?id=${exploit}`);
  expect(res.body.length).toBeGreaterThan(1);
});

test('Ruta segura bloquea inyección', async () => {
  const exploit = '1 OR 1=1';
  const res = await request(app).get(`/sql/secure?id=${exploit}`);
  
  expect(res.status).toBe(400);  // porque la validación debe fallar
  expect(res.body).toHaveProperty('error', 'Parámetros inválidos');
});
