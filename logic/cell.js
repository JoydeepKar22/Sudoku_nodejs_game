class Cell {
  constructor(row, col, value) {
    this.row = row;
    this.col = col;
    this.value = value; // 0 for empty
    this.isGiven = value !== 0; // Was this part of the initial puzzle?
    this.isError = false;
    this.notes = new Set();
  }

  setValue(val) {
    if (!this.isGiven) {
      this.value = val;
    }
  }

  clear() {
    if (!this.isGiven) {
      this.value = 0;
    }
  }

  toggleNote(note) {
    if (!this.isGiven && this.value === 0) {
      if (this.notes.has(note)) {
        this.notes.delete(note);
      } else {
        this.notes.add(note);
      }
    }
  }
}

module.exports = Cell;