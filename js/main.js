import { GameEngine } from './gameEngine.js';

// Wait for the DOM to be fully loaded before starting the game
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.init();
});
