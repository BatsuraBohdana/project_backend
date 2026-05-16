const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Album = require('../src/models/Album');
const Artist = require('../src/models/Artist');

describe('Album API', () => {
  let albumId, artistId;

  beforeAll(async () => {
    await Album.deleteMany({});
    await Artist.deleteMany({});
    const artist = await Artist.create({ name: 'Radiohead', genre: ['Alt Rock'] });
    artistId = artist._id;
  });

  test('POST /api/v1/albums - Create Album', async () => {
    const res = await request(app)
      .post('/api/v1/albums')
      .send({ title: 'OK Computer', artist: artistId, genre: ['Art Rock'] });

    expect(res.statusCode).toBe(201);
    albumId = res.body.data.album._id;
  });

  test('GET /api/v1/albums - Get All', async () => {
    const res = await request(app).get('/api/v1/albums');
    expect(res.statusCode).toBe(200);
    expect(res.body.results).toBe(1);
  });

  test('GET /api/v1/albums/:id - Get One', async () => {
    const res = await request(app).get(`/api/v1/albums/${albumId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.album.title).toBe('OK Computer');
  });

  test('DELETE /api/v1/albums/:id - Delete', async () => {
    const res = await request(app).delete(`/api/v1/albums/${albumId}`);
    expect(res.statusCode).toBe(204);
  });
});
