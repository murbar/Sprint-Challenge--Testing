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
  });
});
