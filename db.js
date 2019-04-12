// game
// {
//   title: 'Pacman', // required
//   genre: 'Arcade', // required
//   releaseYear: 1980 // not required
// };

let games = [
  {
    id: 1,
    title: 'Pacman',
    genre: 'Arcade',
    releaseYear: 1980
  }
];

let id = 2;

function getId() {
  return id++;
}

function getAll() {
  return games;
}

function getById(id) {
  const found = games.filter(g => g.id === id);
  return found.length ? found[0] : null;
}

function create(game) {
  games.push({
    id: getId(),
    ...game
  });
  return games[games.length - 1];
}

function remove(id) {
  const toRemove = games.find(g => g.id === id);
  games = games.filter(g => g.id !== id);
  return !!toRemove;
}

module.exports = {
  getAll,
  getById,
  create,
  remove
};
