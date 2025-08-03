const express = require('express');
const cors = require('cors');
const path = require('path');
const gameApiRoutes = require('./routes/gameApi');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allows communication between frontend and backend
app.use(express.json()); // Parses incoming JSON requests

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/games', gameApiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Sudoku server listening at http://localhost:${port}`);
});