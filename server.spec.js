const request = require('supertest');
const server = require('./server.js');
const db = require('./db');

describe('Games', () => {
  describe('POST /games', () => {
    it('should respond with 422 if game object is invalid', async () => {
      const response = await request(server)
        .post('/games')
        .send({ game: 'Bad request' });
      expect(response.status).toBe(422);
    });

    it('should respond with 201 if game is created successfully', async () => {
      const response = await request(server)
        .post('/games')
        .send({
          title: 'Asteroids',
          genre: 'Arcade',
          releaseYear: 1979
        });
      expect(response.status).toBe(201);
    });

    it('should add a new game to the DB when game created successfully', async () => {
      const recordsCount = db.getAll().length;
      const response = await request(server)
        .post('/games')
        .send({
          title: 'Asteroids',
          genre: 'Arcade',
          releaseYear: 1979
        });
      const newRecordsCount = db.getAll().length;
      expect(newRecordsCount).toBe(recordsCount + 1);
    });

    it('should respond with JSON when a game is created', async () => {
      const response = await request(server)
        .post('/games')
        .send({
          title: 'Asteroids',
          genre: 'Arcade',
          releaseYear: 1979
        });
      expect(response.type).toBe('application/json');
    });

    it('should return the new game when a game is created', async () => {
      const response = await request(server)
        .post('/games')
        .send({
          title: 'Asteroids',
          genre: 'Arcade',
          releaseYear: 1979
        });
      expect(response.body).toEqual(
        expect.objectContaining({
          title: expect.any(String),
          genre: expect.any(String),
          releaseYear: expect.any(Number),
          id: expect.any(Number)
        })
      );
    });
  });

  describe('GET /games', () => {
    it('should respond with 200', async () => {
      const response = await request(server).get('/games');
      expect(response.status).toBe(200);
    });

    it('should respond with JSON', async () => {
      const response = await request(server).get('/games');
      expect(response.type).toBe('application/json');
    });

    it('should return an array of records', async () => {
      const response = await request(server).get('/games');
      console.log(response.body);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return all records', async () => {
      const recordsCount = db.getAll().length;
      const response = await request(server).get('/games');
      expect(response.body).toHaveLength(recordsCount);
    });
  });
});
