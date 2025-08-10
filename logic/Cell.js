class Cell {
  constructor(row, col, value) {
    this.row = row;
    this.col = col;
    this.value = value; // 0 for empty
    this.isGiven = value !== 0;
    this.isError = false;
    this.notes = new Set();
  }

  setValue(val) {
    if (!this.isGiven) {
      this.value = val;
    }
  }
}

module.exports = Cell;