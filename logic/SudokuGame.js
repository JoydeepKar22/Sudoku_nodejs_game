const { v4: uuidv4 } = require('uuid');
const Board = require('./Board');
const PuzzleGenerator = require('./PuzzleGenerator'); // We expect this to be called
const SudokuValidator = require('./SudokuValidator');

class SudokuGame {
  constructor(difficulty) {
    // --- THIS IS THE CHECKPOINT ---
    console.log(`\n--- CHECKPOINT: SudokuGame constructor called for '${difficulty}' difficulty.`);
    console.log('--- Now attempting to use PuzzleGenerator...');
    // ----------------------------

    this.gameId = uuidv4();
    this.difficulty = difficulty;
    this.status = 'NOT_STARTED';
    this.startTime = null;
    this.elapsedTimeInSeconds = 0;
    
    const generator = new PuzzleGenerator();
    const { puzzle, solution } = generator.generate(difficulty);
    
    this.board = new Board(puzzle);
    this.solution = solution;
  }

  startGame() {
    this.status = 'IN_PROGRESS';
    this.startTime = Date.now();
  }

  submitMove(row, col, value) {
    if (this.status !== 'IN_PROGRESS') return { success: false, message: 'Game not in progress.' };

    this.board.updateCellValue(row, col, value);
    SudokuValidator.validateFullBoard(this.board);
    
    const isSolved = SudokuValidator.isBoardSolved(this.board, this.solution);
    if(isSolved) {
        this.status = 'COMPLETED';
        this.elapsedTimeInSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    }
    
    return {
        success: true,
        isComplete: isSolved,
        board: this.board.toPlainObject()
    };
  }
}

module.exports = SudokuGame;