const { v4: uuidv4 } = require('uuid');
const Board = require('./board');
const PuzzleRepository = require('./PuzzleRepository');
const SudokuValidator = require('./SudokuValidator');

class SudokuGame {
  constructor(difficulty) {
    this.gameId = uuidv4();
    this.difficulty = difficulty;
    this.status = 'NOT_STARTED';
    this.startTime = null;
    this.elapsedTimeInSeconds = 0;

    const { puzzle, solution } = PuzzleRepository.getPuzzle(difficulty);
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
    // After any move, re-validate the entire board for errors
    SudokuValidator.validateFullBoard(this.board);

    // Check if the board is solved
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