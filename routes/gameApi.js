const express = require('express');
const SudokuGame = require('../logic/sudokuGame');
const router = express.Router();

// In-memory store for active games. In a real app, use a database.
const activeGames = {};

// POST /api/games - Create a new game
router.post('/', (req, res) => {
  const { difficulty = 'EASY' } = req.body;
  const game = new SudokuGame(difficulty);
  game.startGame();
  activeGames[game.gameId] = game;

  res.json({
    gameId: game.gameId,
    board: game.board.toPlainObject(),
    difficulty: game.difficulty
  });
});

// POST /api/games/:gameId/move - Submit a move
router.post('/:gameId/move', (req, res) => {
  const { gameId } = req.params;
  const { row, col, value } = req.body;
  const game = activeGames[gameId];

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const result = game.submitMove(row, col, parseInt(value, 10) || 0);
  res.json(result);
});

module.exports = router;