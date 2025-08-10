const express = require('express');
const cors = require('cors');
const path = require('path');
const gameApiRoutes = require('./routes/gameApi');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/games', gameApiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Sudoku server running at http://localhost:${port}`);
  console.log('Open your browser to play!');
});