const request = require('supertest');
const server = require('./server.js');
const db = require('./db');

describe('Games', () => {
  describe('GET /games/:id', () => {
    it('should respond with 200', async () => {
      const response = await request(server).get('/games/1');
      expect(response.status).toBe(200);
    });

    it('should respond with JSON', async () => {
      const response = await request(server).get('/games/1');
      expect(response.type).toBe('application/json');
    });

    it('should return a single game', async () => {
      const response = await request(server).get('/games/1');
      expect(Array.isArray(response.body)).not.toBe(true);
    });

    it('should return a valid game object', async () => {
      const response = await request(server).get('/games/1');

      expect(response.body).toEqual(
        expect.objectContaining({
          title: expect.any(String),
          genre: expect.any(String),
          releaseYear: expect.any(Number),
          id: expect.any(Number)
        })
      );
    });

    it('should respond with 404 when no game with given ID is found', async () => {
      const response = await request(server).get('/games/999');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /games', () => {
    it('should respond with 422 if game object is invalid', async () => {
      const response = await request(server)
        .post('/games')
        .send({ game: 'Bad request' });
      expect(response.status).toBe(422);
    });

    it('should respond with 405 if game exists with that title', async () => {
      const response = await request(server)
        .post('/games')
        .send({
          title: 'Pacman',
          genre: 'Arcade',
          releaseYear: 1980
        });
      expect(response.status).toBe(405);
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
          title: 'Pong',
          genre: 'Arcade',
          releaseYear: 1972
        });
      const newRecordsCount = db.getAll().length;
      expect(newRecordsCount).toBe(recordsCount + 1);
    });

    it('should respond with JSON when a game is created', async () => {
      const response = await request(server)
        .post('/games')
        .send({
          title: 'Breakout',
          genre: 'Arcade',
          releaseYear: 1976
        });
      expect(response.type).toBe('application/json');
    });

    it('should return the new game when a game is created', async () => {
      const response = await request(server)
        .post('/games')
        .send({
          title: 'Space Invaders',
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
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return all records', async () => {
      const recordsCount = db.getAll().length;
      const response = await request(server).get('/games');
      expect(response.body).toHaveLength(recordsCount);
    });
  });

  describe('DELETE /games/:id', () => {
    it('should successfully delete a game', async () => {
      const { body: game } = await request(server)
        .post('/games')
        .send({
          title: 'Paperboy',
          genre: 'Arcade',
          releaseYear: 1980
        });
      const recordsCount = db.getAll().length;
      await request(server).delete(`/games/${game.id}`);
      const newRecordsCount = db.getAll().length;
      expect(newRecordsCount).toEqual(recordsCount - 1);
      const nonexistentGame = db.getById(game.id);
      expect(nonexistentGame).toBe(null);
    });

    it('should respond with 204 when user is deleted', async () => {
      const { body: game } = await request(server)
        .post('/games')
        .send({
          title: 'Galaga',
          genre: 'Arcade',
          releaseYear: 1981
        });
      console.log(game);
      const response = await request(server).delete(`/games/${game.id}`);
      expect(response.status).toBe(204);
    });

    it('should respond with 404 when user does not exist', async () => {
      const response = await request(server).delete('/users/55');
      expect(response.status).toBe(404);
    });
  });
});
