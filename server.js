const express = require('express');

const server = express();
const db = require('./db');

server.use(express.json());

const gameIsValid = game => game.title && game.genre && game.releaseYear;

server.post('/games', async (req, res) => {
  const { body: game } = req;
  if (!gameIsValid(game)) {
    res.status(422).json({ error: 'A title, genre, and releaseYear are required.' });
  } else {
    try {
      const newGame = db.create(game);
      res.status(201).json(newGame);
    } catch (error) {
      if (error.message.includes('unique')) {
        res.status(405).json({ error: error.message });
      } else {
        // some other error, re-throw
        throw error;
      }
    }
  }
});

server.get('/games', async (req, res) => {
  const games = db.getAll();
  res.status(200).json(games);
});

server.get('/games/:id', async (req, res) => {
  const { id } = req.params;
  const game = db.getById(parseInt(id));
  if (!game) {
    res.status(404).json({ error: 'No game with that ID.' });
  } else {
    res.status(200).json(game);
  }
});

module.exports = server;
