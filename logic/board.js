const Cell = require('./cell');

class Board {
  constructor(puzzleData) {
    this.SIZE = 9;
    this.grid = [];
    this.initializeBoard(puzzleData);
  }

  initializeBoard(puzzleData) {
    this.grid = [];
    for (let row = 0; row < this.SIZE; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.SIZE; col++) {
        const value = puzzleData[row][col];
        this.grid[row][col] = new Cell(row, col, value);
      }
    }
  }

  getCell(row, col) {
    return this.grid[row][col];
  }

  updateCellValue(row, col, value) {
    const cell = this.getCell(row, col);
    if (cell && !cell.isGiven) {
      cell.setValue(value);
      return true;
    }
    return false;
  }

  // A simple representation for the frontend
  toPlainObject() {
    return this.grid.map(row => 
        row.map(cell => ({
            value: cell.value,
            isGiven: cell.isGiven,
            isError: cell.isError,
            notes: Array.from(cell.notes)
        }))
    );
  }
}

module.exports = Board;