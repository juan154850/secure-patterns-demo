import request from 'supertest';
import app from '../src/app.js';

test('CSRF inseguro permite modificar email sin token', async () => {
  const res = await request(app)
    .post('/csrf/insecure')
    .send({ email: 'attacker@example.com' });

  expect(res.body).toHaveProperty('email', 'attacker@example.com');
});

test('CSRF seguro bloquea si no hay token', async () => {
  const res = await request(app)
    .post('/csrf/secure')
    .send({ email: 'attacker@example.com' });

  expect(res.status).toBe(403);
});

test('CSRF seguro funciona con token válido', async () => {
  const agent = request.agent(app);
  const tokenRes = await agent.get('/csrf/secure/token');
  const cookie = tokenRes.headers['set-cookie'].join('; ');

  const res = await agent
    .post('/csrf/secure')
    .set('Cookie', cookie)
    .send({
      _csrf: tokenRes.body.csrfToken,
      email: 'secure@example.com',
    });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('email', 'secure@example.com');
});
