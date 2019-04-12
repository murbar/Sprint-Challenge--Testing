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
    const newGame = db.create(game);
    res.status(201).json(newGame);
  }
});

module.exports = server;
