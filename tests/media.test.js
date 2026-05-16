const request = require('supertest');
const app = require('../src/app');
const Podcast = require('../src/models/Podcast');
const Audiobook = require('../src/models/Audiobook');
const Playlist = require('../src/models/Playlist');

const Review = require('../src/models/Review');
const User = require('../src/models/User');
const mongoose = require('mongoose');

describe('Media: Podcasts, Audiobooks, Playlists, Reviews', () => {
  let podcastId, audiobookId, playlistId, reviewId, userId;

  beforeAll(async () => {
    process.env.SKIP_AUTH = 'true';
    await Podcast.deleteMany({});
    await Audiobook.deleteMany({});
    await Playlist.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});

    const user = await User.create({ username: 'test', email: 't@t.com', password: 'password1234' });
    userId = user._id;
  });

  describe('Podcast Management', () => {
    test('CRUD Podcast & 404s', async () => {
      const res = await request(app).post('/api/v1/podcasts').send({ title: 'Tech Talk', host: 'John Doe' });
      expect(res.statusCode).toBe(201);
      podcastId = res.body.data.podcast._id;
      await request(app).get('/api/v1/podcasts').expect(200);
      await request(app).get('/api/v1/podcasts').set('Accept', 'text/html').expect(200);

      await request(app).delete(`/api/v1/podcasts/${podcastId}`).expect(204);
      await request(app).get(`/api/v1/podcasts/${podcastId}`).expect(404);
    });
  });

  describe('Audiobook Management', () => {
    test('CRUD Audiobook & 404s', async () => {
      const res = await request(app).post('/api/v1/audiobooks').send({ title: '1984', author: 'George Orwell' });
      expect(res.statusCode).toBe(201);
      audiobookId = res.body.data.audiobook._id;
      await request(app).get('/api/v1/audiobooks').expect(200);
      await request(app).get('/api/v1/audiobooks').set('Accept', 'text/html').expect(200);

      await request(app).delete(`/api/v1/audiobooks/${audiobookId}`).expect(204);
      await request(app).get(`/api/v1/audiobooks/${audiobookId}`).expect(404);

      await request(app).post('/api/v1/audiobooks').send({ title: '', author: '' }).expect(400);
      await request(app).post('/api/v1/audiobooks').send({ title: 'T', author: 'A', duration: 'x' }).expect(400);
    });
  });

  describe('Playlist Management', () => {
    test('CRUD Playlist & 404s', async () => {
      const res = await request(app).post('/api/v1/playlists').send({ name: 'My Favorites' });
      expect(res.statusCode).toBe(201);
      playlistId = res.body.data.playlist._id;
      await request(app).get('/api/v1/playlists').expect(200);
      await request(app).get('/api/v1/playlists').set('Accept', 'text/html').expect(200);

      await request(app).delete(`/api/v1/playlists/${playlistId}`).expect(204);
      await request(app).get(`/api/v1/playlists/${playlistId}`).expect(404);
    });
  });

  describe('Review Management', () => {
    test('CRUD Review & 404s', async () => {
      const res = await request(app).post('/api/v1/reviews').send({ review: 'Great!', rating: 5, user: userId });
      expect(res.statusCode).toBe(201);
      reviewId = res.body.data.review._id;

      await request(app).get('/api/v1/reviews').expect(200);
      await request(app).get('/api/v1/reviews').set('Accept', 'text/html').expect(200);

      await request(app).patch(`/api/v1/reviews/${reviewId}`).send({ review: 'Updated' }).expect(200);
      await request(app).delete(`/api/v1/reviews/${reviewId}`).expect(204);
      await request(app).get(`/api/v1/reviews/${reviewId}`).expect(404);
    });
  });

  describe('Edge Cases (HTML Branches)', () => {
    test('Should handle null/empty fields in HTML view', async () => {
      const db = mongoose.connection.db;
      await db.collection('podcasts').insertOne({ title: '', host: '', description: null });
      await db.collection('reviews').insertOne({ review: '', rating: null, user: null });
      await db.collection('audiobooks').insertOne({ title: '', author: '', narrator: null });
      await db.collection('playlists').insertOne({ name: '', description: null });

      await request(app).get('/api/v1/podcasts').set('Accept', 'text/html').expect(200);
      await request(app).get('/api/v1/reviews').set('Accept', 'text/html').expect(200);
      await request(app).get('/api/v1/audiobooks').set('Accept', 'text/html').expect(200);
      await request(app).get('/api/v1/playlists').set('Accept', 'text/html').expect(200);
    });
  });
});
