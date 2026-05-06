const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Track = require('../src/models/Track');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Track.deleteMany({});
});

describe('Track API', () => {
  const sampleTrack = {
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    tags: ['rock', 'indie']
  };

  test('POST /api/v1/tracks should create a new track', async () => {
    const res = await request(app)
      .post('/api/v1/tracks')
      .send(sampleTrack);

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.track.title).toBe(sampleTrack.title);
  });

  test('GET /api/v1/tracks should get all tracks', async () => {
    await Track.create(sampleTrack);
    const res = await request(app).get('/api/v1/tracks');

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.results).toBe(1);
    expect(res.body.data.tracks[0].title).toBe(sampleTrack.title);
  });

  test('GET /api/v1/tracks/:id should get a single track', async () => {
    const track = await Track.create(sampleTrack);
    const res = await request(app).get(`/api/v1/tracks/${track._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.track.title).toBe(sampleTrack.title);
  });

  test('PATCH /api/v1/tracks/:id should update a track', async () => {
    const track = await Track.create(sampleTrack);
    const res = await request(app)
      .patch(`/api/v1/tracks/${track._id}`)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.track.title).toBe('Updated Title');
  });

  test('DELETE /api/v1/tracks/:id should delete a track', async () => {
    const track = await Track.create(sampleTrack);
    const res = await request(app).delete(`/api/v1/tracks/${track._id}`);

    expect(res.statusCode).toEqual(204);
    
    const findTrack = await Track.findById(track._id);
    expect(findTrack).toBeNull();
  });

  test('GET /api/v1/tracks/export should download tracks JSON', async () => {
    await Track.create(sampleTrack);
    const res = await request(app).get('/api/v1/tracks/export');

    expect(res.statusCode).toEqual(200);
    expect(res.header['content-type']).toMatch(/application\/json; charset=utf-8/i);
    expect(res.header['content-disposition']).toContain('attachment; filename="tracks.json"');
  });

  test('GET /api/v1/tracks with tags filter', async () => {
    await Track.create(sampleTrack);
    await Track.create({ ...sampleTrack, title: 'Other Song', tags: ['pop'] });

    const res = await request(app).get('/api/v1/tracks?tags=rock');

    expect(res.statusCode).toEqual(200);
    expect(res.body.results).toBe(1);
    expect(res.body.data.tracks[0].title).toBe('Test Song');
  });
});
