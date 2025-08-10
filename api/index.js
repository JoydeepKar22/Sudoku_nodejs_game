// The path is now relative to the current folder
const gameApiRoutes = require('./routes/gameApi'); 
// ... (the rest of the file is the same)
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// This path needs to be adjusted to find the public folder from inside the api folder
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/games', gameApiRoutes);

app.listen(port, () => {
  console.log(`Sudoku server running at http://localhost:${port}`);
});