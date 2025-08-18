const express = require('express');
const cors = require('cors');
const app = express();
const PuzzleGenerator = require('./logic/PuzzleGenerator'); // We'll use the real generator

app.use(cors());
app.use(express.json());

// The only API endpoint for creating a game
app.post('/api/games', (req, res) => {
  try {
    const difficulty = req.body.difficulty || 'EASY';
    const generator = new PuzzleGenerator();
    const { puzzle, solution } = generator.generate(difficulty);

    // This is a simplified game object for the response
    const game = {
      gameId: `game_${Date.now()}`,
      board: new (require('./logic/Board'))(puzzle).toPlainObject(),
      difficulty: difficulty,
      // We don't need the full game logic for this to work
    };

    res.status(200).json(game);
  } catch (error) {
    console.error("Error generating puzzle:", error);
    res.status(500).json({ error: "Failed to generate puzzle" });
  }
});

// Export the app for Vercel
module.exports = app;