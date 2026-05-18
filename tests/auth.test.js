const request = require('supertest');
const _mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Authentication & Authorization', () => {
  let adminToken, userToken, _adminId, _userId;

  beforeAll(async () => {
    await User.deleteMany({});

    const admin = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'password1234',
      role: 'admin'
    });
    _adminId = admin._id;

    const user = await User.create({
      username: 'user',
      email: 'user@test.com',
      password: 'password1234',
      role: 'user'
    });
    _userId = user._id;

    const adminRes = await request(app).post('/api/v1/users/login').send({
      email: 'admin@test.com',
      password: 'password1234'
    });
    adminToken = adminRes.body.token;

    const userRes = await request(app).post('/api/v1/users/login').send({
      email: 'user@test.com',
      password: 'password1234'
    });
    userToken = userRes.body.token;
  });

  describe('Auth Controller', () => {
    test('Signup - Should create a new user', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          username: 'newuser',
          email: 'new@test.com',
          password: 'password1234'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.token).toBeDefined();
    });

    test('Login - Should fail with wrong credentials', async () => {
      await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'admin@test.com', password: 'wrong' })
        .expect(401);
    });

    test('Login - Should fail with missing email/password', async () => {
      await request(app)
        .post('/api/v1/users/login')
        .send({ email: '' })
        .expect(400);
    });
  });

  describe('Protection & Roles Middleware', () => {
    beforeEach(() => {
      process.env.SKIP_AUTH = 'false';
    });

    afterAll(() => {
      process.env.SKIP_AUTH = 'true';
    });

    test('Protect - Should fail without token', async () => {
      await request(app).get('/api/v1/users').expect(401);
    });

    test('Protect - Should fail with invalid token', async () => {
      await request(app)
        .get('/api/v1/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    test('Protect - Should fail if user no longer exists', async () => {
      const tempUser = await User.create({
        username: 'temp',
        email: 'temp@test.com',
        password: 'password1234'
      });
      const tempToken = jwt.sign({ id: tempUser._id }, process.env.JWT_SECRET);
      await User.findByIdAndDelete(tempUser._id);

      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${tempToken}`)
        .expect(401);
    });

    test('RestrictTo - User should not access admin routes', async () => {
      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    test('RestrictTo - Admin should access admin routes', async () => {
      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  describe('SKIP_AUTH Behavior', () => {
    test('Should bypass auth when SKIP_AUTH is true', async () => {
      process.env.SKIP_AUTH = 'true';
      await request(app).get('/api/v1/users').expect(200);
    });
  });
});
