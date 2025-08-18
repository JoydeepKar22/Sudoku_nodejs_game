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



app.use('/api/games', gameApiRoutes);

module.exports = app;