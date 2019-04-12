const express = require('express');

const server = express();
const db = require('./db');

server.use(express.json());

server.post('/games', async (req, res) => {
  res.status(200).json();
});

module.exports = server;
