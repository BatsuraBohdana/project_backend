const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('User Management', () => {
  let adminToken, testUserId;

  beforeAll(async () => {
    process.env.SKIP_AUTH = 'true';
    await User.deleteMany({});

    const _admin = await User.create({
      username: 'admin',
      email: 'admin@u.com',
      password: 'password1234',
      role: 'admin'
    });

    const res = await request(app).post('/api/v1/users/login').send({
      email: 'admin@u.com',
      password: 'password1234'
    });
    adminToken = res.body.token;
  });

  test('POST /api/v1/users - Should create a new user (admin only)', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'testuser',
        email: 'test@u.com',
        password: 'password1234'
      });

    expect(res.statusCode).toBe(201);
    testUserId = res.body.data.user._id;
  });

  test('GET /api/v1/users - Should get all users', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.users)).toBe(true);
  });

  test('GET /api/v1/users/:id - Should get user by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.username).toBe('testuser');
  });

  test('PATCH /api/v1/users/:id - Should update user', async () => {
    const res = await request(app)
      .patch(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'updatedname' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.username).toBe('updatedname');
  });

  test('DELETE /api/v1/users/:id - Should delete user', async () => {
    await request(app)
      .delete(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);

    await request(app)
      .get(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
