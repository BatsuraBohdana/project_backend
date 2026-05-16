const request = require('supertest');
const app = require('../src/app');
const Track = require('../src/models/Track');

describe('Track API', () => {
  let trackId;

  beforeAll(async () => {
    await Track.deleteMany({});
  });

  test('POST /api/v1/tracks - Create Track', async () => {
    const res = await request(app)
      .post('/api/v1/tracks')
      .send({ title: '  In the End  ', artist: 'Linkin Park', duration: 216 });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.track.title).toBe('In the End');
    trackId = res.body.data.track._id;
  });

  test('GET /api/v1/tracks - Get All (JSON)', async () => {
    const res = await request(app).get('/api/v1/tracks');
    expect(res.statusCode).toBe(200);
    expect(res.body.results).toBe(1);
  });

  test('GET /api/v1/tracks - Get All (HTML)', async () => {
    const res = await request(app).get('/api/v1/tracks').set('Accept', 'text/html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('In the End');
  });

  test('GET /api/v1/tracks/:id - Get One', async () => {
    const res = await request(app).get(`/api/v1/tracks/${trackId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.track.title).toBe('In the End');
  });

  test('PATCH /api/v1/tracks/:id - Update', async () => {
    const res = await request(app)
      .patch(`/api/v1/tracks/${trackId}`)
      .send({ title: 'Numb' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.track.title).toBe('Numb');
  });

  test('DELETE /api/v1/tracks/:id - Delete', async () => {
    const res = await request(app).delete(`/api/v1/tracks/${trackId}`);
    expect(res.statusCode).toBe(204);
  });

  test('GET /api/v1/tracks/:id - 404', async () => {
    const fakeId = '6a08941a340482c3865b3e96';
    const res = await request(app).get(`/api/v1/tracks/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
