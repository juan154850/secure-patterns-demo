import request from 'supertest';
import app from '../src/app.js';

test('XSS inseguro refleja código no escapado', async () => {
  const script = '<script>alert(\'XSS\')</script>';
  const res = await request(app).get(`/xss/insecure?name=${encodeURIComponent(script)}`);
  expect(res.text).toContain(script); // Refleja directamente
});

test('XSS seguro escapa los caracteres especiales', async () => {
  const script = '<script>alert(\'XSS\')</script>';
  const res = await request(app).get(`/xss/secure?name=${encodeURIComponent(script)}`);
  expect(res.text).not.toContain(script);
  expect(res.text).toContain('&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;'); // Confirmar que se escapó
});
