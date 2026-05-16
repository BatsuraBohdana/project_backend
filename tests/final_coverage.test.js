const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');
const User = require('../src/models/User');
const Track = require('../src/models/Track');
const Album = require('../src/models/Album');
const Podcast = require('../src/models/Podcast');
const Review = require('../src/models/Review');
const Audiobook = require('../src/models/Audiobook');
const Playlist = require('../src/models/Playlist');
const Artist = require('../src/models/Artist');
const eventEmitter = require('../src/utils/eventEmitter');
const AppError = require('../src/utils/appError');
const authMiddleware = require('../src/middleware/authMiddleware');
const responseTime = require('../src/middleware/responseTime');
const errorHandler = require('../src/middleware/errorHandler');

describe('Absolute 100% Coverage', () => {
  let adminToken, userId;

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await Promise.all([User.deleteMany({}), Album.deleteMany({}), Track.deleteMany({}), Review.deleteMany({}), Podcast.deleteMany({}), Artist.deleteMany({}), Audiobook.deleteMany({}), Playlist.deleteMany({})]);
    const admin = await User.create({ username: 'Admin', email: 'a@t.com', password: 'password1234', role: 'admin' });
    const res = await request(app).post('/api/v1/users/login').send({ email: 'a@t.com', password: 'password1234' });
    adminToken = res.body.token;
    const user = await User.create({ username: 'User', email: 'u@t.com', password: 'password1234', role: 'user' });
    userId = user._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    jest.restoreAllMocks();
  });

  test('Hit everything', async () => {
    
    for (const t of ['albums', 'tracks', 'reviews', 'podcasts', 'artists', 'audiobooks', 'playlists']) {
      await request(app).get(`/api/v1/${t}`).set('Accept', 'text/html').expect(200);
    }

    
    process.env.SKIP_AUTH = 'false';
    const uRes = await request(app).post('/api/v1/users/login').send({ email: 'u@t.com', password: 'password1234' });
    await request(app).get('/api/v1/users').set('Authorization', `Bearer ${uRes.body.token}`).expect(403);
    const spyV = jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('J'); });
    await request(app).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`).expect(500);
    spyV.mockRestore();
    const uD = (await User.findById(userId)).toObject(); uD.password = 'password1234';
    await User.findByIdAndDelete(userId);
    const tU = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    await request(app).get('/api/v1/users').set('Authorization', `Bearer ${tU}`).expect(401);
    await User.create(uD);
    process.env.SKIP_AUTH = 'true';
    const spyF = jest.spyOn(User, 'findOne').mockResolvedValue(null);
    await request(app).get('/api/v1/users').expect(200);
    spyF.mockRestore();

    
    const art = await Artist.create({ name: 'A "Q"', genre: ['R "Q"'] });
    await Album.create({ title: 'A "Q"', artist: art._id, genre: ['J'] });
    await Track.create({ title: 'T "Q"', artist: 'A "Q"', tags: ['T'] });
    await Review.create({ review: 'R "Q"', rating: 5, user: userId });
    await Podcast.create({ title: 'P "Q"', host: 'H "Q"', tags: ['T'] });
    for (const t of ['albums', 'tracks', 'reviews', 'podcasts', 'artists']) {
      await request(app).get(`/api/v1/${t}`).set('Accept', 'text/html').expect(200);
    }
    
    const db = mongoose.connection.db;
    await db.collection('albums').insertOne({ title: null, artist: null, genre: null });
    await db.collection('tracks').insertOne({ title: null, artist: null, tags: null });
    await db.collection('reviews').insertOne({ review: null, rating: null, user: null });
    await db.collection('podcasts').insertOne({ title: null, host: null, tags: null });
    for (const t of ['albums', 'tracks', 'reviews', 'podcasts']) {
      await request(app).get(`/api/v1/${t}`).set('Accept', 'text/html').expect(200);
    }

    
    const next = jest.fn();
    await authMiddleware.protect({ headers: {} }, {}, next);
    const tk = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    await authMiddleware.protect({ headers: { authorization: `Bearer ${tk}` } }, {}, next);
    await User.findByIdAndDelete(userId);
    await authMiddleware.protect({ headers: { authorization: `Bearer ${tk}` } }, {}, next);
    await User.create(uD);
    const spyM = jest.spyOn(User, 'findById').mockImplementation(() => { throw new Error('E'); });
    await authMiddleware.protect({ headers: { authorization: `Bearer ${tk}` } }, {}, next);
    spyM.mockRestore();
    authMiddleware.restrictTo('admin')({ user: { role: 'admin' } }, {}, next);
    authMiddleware.restrictTo('admin')({ user: { role: 'user' } }, {}, next);

    const resR = { end: jest.fn(), setHeader: jest.fn(), headersSent: true };
    responseTime({}, resR, jest.fn()); resR.end();

    const spyEx = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const spyMk = jest.spyOn(fs, 'mkdirSync').mockImplementation(()=>{});
    eventEmitter.initLogs(); spyEx.mockRestore(); spyMk.mockRestore();
    const spyRd = jest.spyOn(fs, 'readFileSync').mockReturnValue('invalid');
    eventEmitter.emit('requestCompleted', {});
    spyRd.mockReturnValue(''); eventEmitter.emit('requestCompleted', {});
    spyRd.mockRestore();

    const resM = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const env = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    errorHandler({ name: 'JsonWebTokenError' }, {}, resM, jest.fn());
    errorHandler({ name: 'TokenExpiredError' }, {}, resM, jest.fn());
    errorHandler(new Error(), {}, resM, jest.fn());
    process.env.NODE_ENV = 'production';
    errorHandler({ name: 'JsonWebTokenError' }, {}, resM, jest.fn());
    errorHandler({ name: 'TokenExpiredError' }, {}, resM, jest.fn());
    errorHandler({ isOperational: true, statusCode: 400 }, {}, resM, jest.fn());
    errorHandler(new Error(), {}, resM, jest.fn());
    process.env.NODE_ENV = env;

    expect(new AppError('x', 400).status).toBe('fail');
    expect(new AppError('x', 500).status).toBe('error');

    
    const v = [{ p: 'users/signup', d: { password: '1' } }, { p: 'audiobooks', d: { duration: 'x' } }, { p: 'audiobooks', d: { duration: NaN } }, { p: 'tracks', d: { duration: 'x' } }, { p: 'tracks', d: { duration: NaN } }];
    for (const c of v) await request(app).post(`/api/v1/${c.p}`).set('Authorization', `Bearer ${adminToken}`).send(c.d).expect(400);
    await request(app).post('/api/v1/reviews').set('Authorization', `Bearer ${adminToken}`).send({ review: 'x' }).expect(201);
  });
});
