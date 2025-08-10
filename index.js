const express = require('express');
const cors = require('cors');
const path = require('path');
const gameApiRoutes = require('./routes/gameApi');

const app = express();
const port = 3000;

// Middleware
<<<<<<< HEAD
app.use(cors()); // Allows communication between frontend and backend
app.use(express.json()); // Parses incoming JSON requests

// Serve static files from the 'public' directory
app.use(express.static( 'public'));
=======
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
>>>>>>> 81539fb (Final project setup)

// API routes
app.use('/api/games', gameApiRoutes);

// Start the server
app.listen(port, () => {
<<<<<<< HEAD
  console.log(`Sudoku server listening at http://localhost:${port}`);
});
=======
  console.log(`Sudoku server running at http://localhost:${port}`);
  console.log('Open your browser to play!');
});
>>>>>>> 81539fb (Final project setup)
