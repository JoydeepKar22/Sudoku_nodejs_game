/**
 * Represents a single cell on the Sudoku grid.
 */
export class Cell {
    constructor(value, row, col) {
        this.value = value; // The number in the cell (0 if empty)
        this.row = row;
        this.col = col;
        this.isGiven = value !== 0; // Was this cell part of the initial puzzle?
        this.isError = false; // Is this cell currently in a conflict?
    }
}

/**
 * Represents the 9x9 Sudoku grid data structure.
 */
export class Grid {
    constructor() {
        this.cells = Array(9).fill(null).map(() => Array(9).fill(null));
    }

    fromMatrix(matrix) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                this.cells[r][c] = new Cell(matrix[r][c], r, c);
            }
        }
    }
}

/**
 * Solves Sudoku puzzles using a backtracking algorithm.
 */
class SudokuSolver {
    constructor() {
        this.solutionCount = 0;
    }

    _findEmpty(grid) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) return [r, c];
            }
        }
        return null;
    }

    _isValid(grid, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num || grid[i][col] === num) return false;
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (grid[startRow + r][startCol + c] === num) return false;
            }
        }
        return true;
    }

    countSolutions(grid) {
        this.solutionCount = 0;
        this._countSolutionsHelper(grid);
        return this.solutionCount;
    }
    
    _countSolutionsHelper(grid) {
        const find = this._findEmpty(grid);
        if (!find) {
            this.solutionCount++;
            return;
        }
        const [row, col] = find;
        
        for (let num = 1; num <= 9; num++) {
            if(this.solutionCount > 1) break;
            if (this._isValid(grid, row, col, num)) {
                grid[row][col] = num;
                this._countSolutionsHelper(grid);
                grid[row][col] = 0; // Backtrack
            }
        }
    }
}

/**
 * Manages difficulty settings.
 */
class DifficultyManager {
    constructor() {
        this.settings = {
            easy: { clues: 36, maxClues: 49 },
            medium: { clues: 32, maxClues: 35 },
            hard: { clues: 22, maxClues: 31 }
        };
    }

    getCluesFor(difficulty) {
        const setting = this.settings[difficulty];
        return Math.floor(Math.random() * (setting.maxClues - setting.clues + 1)) + setting.clues;
    }
}

/**
 * Generates unique, solvable Sudoku puzzles.
 */
export class SudokuGenerator {
    constructor() {
        this.solver = new SudokuSolver();
        this.difficultyManager = new DifficultyManager();
    }

    generatePuzzle(difficulty) {
        const solutionGrid = this._generateSolution();
        const puzzleGrid = this._createPuzzle(solutionGrid, difficulty);
        return { puzzle: puzzleGrid, solution: solutionGrid };
    }

    _generateSolution() {
        const grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this._fillGrid(grid);
        return grid;
    }

    _fillGrid(grid) {
        const find = this.solver._findEmpty(grid);
        if (!find) return true;
        
        const [row, col] = find;
        const numbers = this._shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of numbers) {
            if (this.solver._isValid(grid, row, col, num)) {
                grid[row][col] = num;
                if (this._fillGrid(grid)) return true;
                grid[row][col] = 0;
            }
        }
        return false;
    }

    _createPuzzle(solution, difficulty) {
        const puzzle = solution.map(row => [...row]);
        const cellsToRemove = 81 - this.difficultyManager.getCluesFor(difficulty);
        
        const cells = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                cells.push([r, c]);
            }
        }
        this._shuffle(cells);

        let removedCount = 0;
        for (const [r, c] of cells) {
            if (removedCount >= cellsToRemove) break;

            const temp = puzzle[r][c];
            puzzle[r][c] = 0;

            const tempGrid = puzzle.map(row => [...row]);
            if (this.solver.countSolutions(tempGrid) !== 1) {
                puzzle[r][c] = temp;
            } else {
                removedCount++;
            }
        }
        return puzzle;
    }

    _shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
