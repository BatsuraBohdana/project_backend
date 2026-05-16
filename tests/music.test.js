const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/Artist');
const Album = require('../src/models/Album');
const Track = require('../src/models/Track');

describe('Music: Artists, Albums, Tracks', () => {
  let artistId, albumId, trackId;

  beforeAll(async () => {
    process.env.SKIP_AUTH = 'true';
    await Artist.deleteMany({});
    await Album.deleteMany({});
    await Track.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Artist Management', () => {
    test('CRUD Artist & 404s', async () => {

      const res = await request(app).post('/api/v1/artists').send({ name: 'Metallica', genre: ['Metal'] });
      expect(res.statusCode).toBe(201);
      artistId = res.body.data.artist._id;

      await request(app).get('/api/v1/artists').expect(200);
      await request(app).get('/api/v1/artists').set('Accept', 'text/html').expect(200);

      await request(app).get(`/api/v1/artists/${artistId}`).expect(200);

      await request(app).patch(`/api/v1/artists/${artistId}`).send({ name: 'Updated Artist' }).expect(200);

      await request(app).delete(`/api/v1/artists/${artistId}`).expect(204);

      await request(app).get(`/api/v1/artists/${artistId}`).expect(404);
      await request(app).patch(`/api/v1/artists/${artistId}`).send({ name: 'x' }).expect(404);
      await request(app).delete(`/api/v1/artists/${artistId}`).expect(404);
    });
  });

  describe('Album Management', () => {
    test('CRUD Album & 404s', async () => {
      const res = await request(app).post('/api/v1/albums').send({
        title: 'Master of Puppets',
        artist: new mongoose.Types.ObjectId(),
        genre: ['Metal']
      });
      expect(res.statusCode).toBe(201);
      albumId = res.body.data.album._id;

      await request(app).get('/api/v1/albums').expect(200);
      await request(app).get('/api/v1/albums').set('Accept', 'text/html').expect(200);
      await request(app).get(`/api/v1/albums/${albumId}`).expect(200);

      await request(app).delete(`/api/v1/albums/${albumId}`).expect(204);
      await request(app).get(`/api/v1/albums/${albumId}`).expect(404);
    });
  });

  describe('Track Management', () => {
    test('CRUD Track & 404s', async () => {
      const res = await request(app).post('/api/v1/tracks').send({
        title: 'Battery',
        artist: 'Metallica',
        duration: 312
      });
      expect(res.statusCode).toBe(201);
      trackId = res.body.data.track._id;

      await request(app).get('/api/v1/tracks').expect(200);
      await request(app).get('/api/v1/tracks').set('Accept', 'text/html').expect(200);

      await request(app).delete(`/api/v1/tracks/${trackId}`).expect(204);
      await request(app).get(`/api/v1/tracks/${trackId}`).expect(404);

      await request(app).post('/api/v1/tracks').send({ title: '', artist: '' }).expect(400);
      await request(app).post('/api/v1/tracks').send({ title: 'T', artist: 'A', duration: 'invalid' }).expect(400);
    });
  });

  describe('Edge Cases (HTML Branches)', () => {
    test('Should handle null/empty fields in HTML view', async () => {

      await Album.collection.insertOne({ title: '', artist: null, genre: null });
      await Track.collection.insertOne({ title: '', artist: '', duration: null });
      await Artist.collection.insertOne({ name: '', genre: null });

      await request(app).get('/api/v1/albums').set('Accept', 'text/html').expect(200);
      await request(app).get('/api/v1/tracks').set('Accept', 'text/html').expect(200);
      await request(app).get('/api/v1/artists').set('Accept', 'text/html').expect(200);
    });
  });
});
