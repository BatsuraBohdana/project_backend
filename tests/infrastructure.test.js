const fs = require('fs');
const path = require('path');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const eventEmitter = require('../src/utils/eventEmitter');
const errorHandler = require('../src/middleware/errorHandler');
const AppError = require('../src/utils/appError');
const APIFeatures = require('../src/utils/apiFeatures');
const Track = require('../src/models/Track');
const User = require('../src/models/User');
const Album = require('../src/models/Album');
const Artist = require('../src/models/Artist');
const Podcast = require('../src/models/Podcast');
const Playlist = require('../src/models/Playlist');
const Audiobook = require('../src/models/Audiobook');
const Review = require('../src/models/Review');
const TemplateEngine = require('../src/utils/templateEngine');

describe('Infrastructure & Utils', () => {
  describe('Error Handler Middleware', () => {
    let res;
    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    test('Should handle AppError in development', () => {
      const err = new AppError('Test error', 400);
      process.env.NODE_ENV = 'development';
      errorHandler(err, {}, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'fail' }));
    });

    test('Should handle production mode errors', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      errorHandler(new AppError('Op', 400), {}, res, () => {});
      expect(res.status).toHaveBeenCalledWith(400);

      errorHandler(new Error('Non-Op'), {}, res, () => {});
      expect(res.status).toHaveBeenCalledWith(500);

      process.env.NODE_ENV = originalEnv;
      consoleSpy.mockRestore();
    });

    test('Should handle JWT errors', () => {
      const err = { name: 'JsonWebTokenError' };
      errorHandler(err, {}, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('Should handle TokenExpiredError', () => {
      const err = { name: 'TokenExpiredError' };
      errorHandler(err, {}, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('Event Emitter (Logging)', () => {
    test('Should log request completed event', () => {
      const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      eventEmitter.emit('requestCompleted', { method: 'GET', url: '/test' });
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test('Should handle log reading error gracefully', () => {
      const spy = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('Read fail'); });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      eventEmitter.emit('requestCompleted', { method: 'GET' });
      expect(consoleSpy).toHaveBeenCalled();
      spy.mockRestore();
      consoleSpy.mockRestore();
    });

    test('Should handle log writing error gracefully', () => {
      const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error('Write fail'); });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      eventEmitter.emit('requestCompleted', { method: 'GET' });
      expect(consoleSpy).toHaveBeenCalled();
      spy.mockRestore();
      consoleSpy.mockRestore();
    });

    test('Should mkdirSync if logs dir missing', () => {
      const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
      if (eventEmitter.initLogs) eventEmitter.initLogs();
      expect(mkdirSpy).toHaveBeenCalled();
      existsSpy.mockRestore();
      mkdirSpy.mockRestore();
    });
  });

  describe('API Features & Utils', () => {
    test('Filter, Sort, Limit, Paginate', () => {
      const query = Track.find();
      const queryString = { sort: 'title', fields: 'title,artist', page: '2', limit: '10' };
      const features = new APIFeatures(query, queryString)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      expect(features.query).toBeDefined();
    });

    test('AppError non-4xx status', () => {
      const err = new AppError('Server Error', 500);
      expect(err.status).toBe('error');
    });

    test('TemplateEngine remaining placeholders', () => {
      const html = TemplateEngine.render('login', { EXTRA: 'data' });
      expect(html).not.toContain('{{');
    });
  });

  describe('Global Routes & Auth Edge Cases', () => {
    test('GET / - Should redirect', async () => {
      await request(app).get('/').expect(302);
    });

    test('GET /login and /signup - Should render', async () => {
      await request(app).get('/login').expect(200);
      await request(app).get('/signup').expect(200);
    });

    test('Unknown route - Should return 404', async () => {
      await request(app).get('/api/v1/non-existent').expect(404);
    });

    test('Rate limiter handler', () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      app.limiterHandler({}, res, null, { message: 'err' });
      expect(res.status).toHaveBeenCalledWith(429);
    });

    test('User validation error', async () => {
      await request(app).post('/api/v1/users/signup').send({ username: 'a' }).expect(400);
    });

    test('Audiobook validation error', async () => {
      await request(app).post('/api/v1/audiobooks').send({ title: 'T', author: '' }).expect(400);
    });

    test('User password modification pre-save hook', async () => {
      const user = await User.create({ username: 'u_infra', email: 'u_infra@t.com', password: 'password123' });
      user.username = 'u_infra2';
      await user.save();
      expect(user.username).toBe('u_infra2');
      await User.deleteOne({ _id: user._id });
    });

    test('Track pre-save trim hook', async () => {
      const track = await Track.create({ title: '  Trimmed Title  ', artist: 'A', duration: 100 });
      expect(track.title).toBe('Trimmed Title');
      await Track.deleteOne({ _id: track._id });
    });

    test('ResponseTime headersSent branch', async () => {
      const mockRes = { headersSent: true, end: jest.fn(), setHeader: jest.fn() };
      const responseTimeMiddleware = require('../src/middleware/responseTime');
      responseTimeMiddleware({}, mockRes, () => {});
      mockRes.end();
      expect(mockRes.setHeader).not.toHaveBeenCalled();
    });
  });

  describe('Controller Success & 404 Coverage', () => {
    const fakeId = '6a08941a340482c3865b3e96';

    test('CRUD Success & 404 for All Entities', async () => {

      const ab = await Audiobook.create({ title: 'B', author: 'A', duration: 100 });
      await request(app).get(`/api/v1/audiobooks/${ab._id}`).expect(200);
      await request(app).patch(`/api/v1/audiobooks/${ab._id}`).send({ title: 'B2' }).expect(200);
      await request(app).delete(`/api/v1/audiobooks/${ab._id}`).expect(204);
      await request(app).get(`/api/v1/audiobooks/${fakeId}`).expect(404);
      await request(app).patch(`/api/v1/audiobooks/${fakeId}`).send({ title: 'B2' }).expect(404);
      await request(app).delete(`/api/v1/audiobooks/${fakeId}`).expect(404);

      const p = await Podcast.create({ title: 'P', host: 'H', duration: 100 });
      await request(app).get(`/api/v1/podcasts/${p._id}`).expect(200);
      await request(app).patch(`/api/v1/podcasts/${p._id}`).send({ title: 'P2' }).expect(200);
      await request(app).delete(`/api/v1/podcasts/${p._id}`).expect(204);
      await request(app).get(`/api/v1/podcasts/${fakeId}`).expect(404);
      await request(app).patch(`/api/v1/podcasts/${fakeId}`).send({ title: 'P2' }).expect(404);
      await request(app).delete(`/api/v1/podcasts/${fakeId}`).expect(404);

      const pl = await Playlist.create({ name: 'L', creator: 'C', tracks: [] });
      await request(app).get(`/api/v1/playlists/${pl._id}`).expect(200);
      await request(app).patch(`/api/v1/playlists/${pl._id}`).send({ name: 'L2' }).expect(200);
      await request(app).delete(`/api/v1/playlists/${pl._id}`).expect(204);
      await request(app).get(`/api/v1/playlists/${fakeId}`).expect(404);
      await request(app).patch(`/api/v1/playlists/${fakeId}`).send({ name: 'L2' }).expect(404);
      await request(app).delete(`/api/v1/playlists/${fakeId}`).expect(404);

      const t = await Track.create({ title: 'T', artist: 'A', duration: 100 });
      await request(app).get(`/api/v1/tracks/${t._id}`).expect(200);
      await request(app).patch(`/api/v1/tracks/${t._id}`).send({ title: 'T2' }).expect(200);
      await request(app).delete(`/api/v1/tracks/${t._id}`).expect(204);
      await request(app).get(`/api/v1/tracks/${fakeId}`).expect(404);
      await request(app).patch(`/api/v1/tracks/${fakeId}`).send({ title: 'T2' }).expect(404);
      await request(app).delete(`/api/v1/tracks/${fakeId}`).expect(404);

      const al = await Album.create({ title: 'A', artist: new mongoose.Types.ObjectId(), genre: ['G'] });
      await request(app).get(`/api/v1/albums/${al._id}`).expect(200);
      await request(app).patch(`/api/v1/albums/${al._id}`).send({ title: 'A2' }).expect(200);
      await request(app).delete(`/api/v1/albums/${al._id}`).expect(204);
      await request(app).get(`/api/v1/albums/${fakeId}`).expect(404);
      await request(app).patch(`/api/v1/albums/${fakeId}`).send({ title: 'A2' }).expect(404);
      await request(app).delete(`/api/v1/albums/${fakeId}`).expect(404);

      const ar = await Artist.create({ name: 'R', genre: ['G'] });
      await request(app).get(`/api/v1/artists/${ar._id}`).expect(200);
      await request(app).patch(`/api/v1/artists/${ar._id}`).send({ name: 'R2' }).expect(200);
      await request(app).delete(`/api/v1/artists/${ar._id}`).expect(204);
      await request(app).get(`/api/v1/artists/${fakeId}`).expect(404);
      await request(app).patch(`/api/v1/artists/${fakeId}`).send({ name: 'R2' }).expect(404);
      await request(app).delete(`/api/v1/artists/${fakeId}`).expect(404);

      const rev = await Review.create({ track: new mongoose.Types.ObjectId(), user: new mongoose.Types.ObjectId(), rating: 5, review: 'G' });
      await request(app).get(`/api/v1/reviews/${rev._id}`).expect(200);
      await request(app).patch(`/api/v1/reviews/${rev._id}`).send({ review: 'G2' }).expect(200);
      await request(app).delete(`/api/v1/reviews/${rev._id}`).expect(204);
      await request(app).get(`/api/v1/reviews/${fakeId}`).expect(404);
      await request(app).patch(`/api/v1/reviews/${fakeId}`).send({ review: 'G2' }).expect(404);
      await request(app).delete(`/api/v1/reviews/${fakeId}`).expect(404);

      await request(app).get(`/api/v1/users/${fakeId}`).expect(404);
      await request(app).patch(`/api/v1/users/${fakeId}`).send({ username: 'u' }).expect(404);
      await request(app).delete(`/api/v1/users/${fakeId}`).expect(404);
    });

    test('HTML Empty States for All Controllers', async () => {
      await Track.deleteMany({});
      await Album.deleteMany({});
      await Artist.deleteMany({});
      await Playlist.deleteMany({});
      await Audiobook.deleteMany({});
      await Podcast.deleteMany({});
      await Review.deleteMany({});

      const entities = ['tracks', 'albums', 'artists', 'playlists', 'audiobooks', 'podcasts', 'reviews'];
      for (const entity of entities) {
        await request(app).get(`/api/v1/${entity}`).set('Accept', 'text/html').expect(200);
      }
    });
  });
});
