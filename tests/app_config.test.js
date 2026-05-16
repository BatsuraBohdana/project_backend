const request = require('supertest');
const app = require('../src/app');

describe('Global App Configuration', () => {
  test('GET / - Should redirect to default API', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe('/api/v1/tracks');
  });

  test('Rate Limiter Handler', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    app.limiterHandler({}, res, null, { message: 'Too many' });
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'fail' }));
  });

  test('404 for non-existent API routes', async () => {
    const res = await request(app).get('/api/v1/ghost');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain('Не вдалося знайти');
  });
});
