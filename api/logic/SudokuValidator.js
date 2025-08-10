class SudokuValidator {
  static isMoveValid(board, row, col, value) {
    if (value < 1 || value > 9) return false;

    // Check row
    for (let c = 0; c < 9; c++) {
<<<<<<< HEAD
      if (board.grid[row][c].value === value && c !== col) {
        return false;
      }
=======
      if (board.grid[row][c].value === value && c !== col) return false;
>>>>>>> 81539fb (Final project setup)
    }

    // Check column
    for (let r = 0; r < 9; r++) {
<<<<<<< HEAD
      if (board.grid[r][col].value === value && r !== row) {
        return false;
      }
=======
      if (board.grid[r][col].value === value && r !== row) return false;
>>>>>>> 81539fb (Final project setup)
    }

    // Check 3x3 sub-grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board.grid[startRow + r][startCol + c].value === value && (startRow + r !== row || startCol + c !== col)) {
          return false;
        }
      }
    }
<<<<<<< HEAD

=======
>>>>>>> 81539fb (Final project setup)
    return true;
  }

  static validateFullBoard(board) {
<<<<<<< HEAD
      // Clear all previous errors
=======
>>>>>>> 81539fb (Final project setup)
      for(let r = 0; r < 9; r++) {
          for(let c = 0; c < 9; c++) {
              board.grid[r][c].isError = false;
          }
      }

<<<<<<< HEAD
      let hasErrors = false;
      for(let r = 0; r < 9; r++) {
          for(let c = 0; c < 9; c++) {
              const cell = board.grid[r][c];
              if(cell.value !== 0) {
                  if(!this.isMoveValid(board, r, c, cell.value)) {
                      cell.isError = true;
                      hasErrors = true;
                  }
              }
          }
      }
      return !hasErrors;
=======
      for(let r = 0; r < 9; r++) {
          for(let c = 0; c < 9; c++) {
              const cell = board.grid[r][c];
              if(cell.value !== 0 && !this.isMoveValid(board, r, c, cell.value)) {
                  cell.isError = true;
              }
          }
      }
>>>>>>> 81539fb (Final project setup)
  }

  static isBoardSolved(board, solution) {
     for(let r = 0; r < 9; r++) {
         for(let c = 0; c < 9; c++) {
<<<<<<< HEAD
             if(board.grid[r][c].value !== solution[r][c]) {
                 return false;
             }
=======
             if(board.grid[r][c].value !== solution[r][c]) return false;
>>>>>>> 81539fb (Final project setup)
         }
     }
     return true;
  }
}

module.exports = SudokuValidator;