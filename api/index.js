const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// This is the only API endpoint. It always returns the same simple puzzle.
app.post('/api/games', (req, res) => {
  console.log("--- TEST SERVER: /api/games endpoint was reached successfully! ---");

  // A simple, hardcoded board for testing
  const testBoard = Array.from({ length: 9 }, (_, r) => 
    Array.from({ length: 9 }, (_, c) => ({
      value: (r === 0 && c === 0) ? 1 : 0, // Put a '1' in the top-left corner
      isGiven: (r === 0 && c === 0),
      isError: false,
      notes: []
    }))
  );

  res.json({
    gameId: 'test-game',
    board: testBoard,
    difficulty: 'TEST'
  });
});

// Export the app for Vercel
module.exports = app;