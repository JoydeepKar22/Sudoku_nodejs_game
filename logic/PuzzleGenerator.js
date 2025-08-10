// (The SudokuSolver class code is the same as before, so it's omitted here for brevity)
// (Just make sure it's still at the top of the file)
class SudokuSolver {
    constructor(grid) { this.grid = grid; this.counter = 0; }
    solve() { this.counter = 0; this.solveRecursive(this.grid); return this.counter; }
    solveRecursive(grid) {
        const find = this.findEmpty(grid);
        if (!find) { this.counter++; return; }
        const [row, col] = find;
        for (let i = 1; i <= 9; i++) {
            if (this.isValid(grid, i, row, col)) {
                grid[row][col] = i;
                this.solveRecursive(grid);
                grid[row][col] = 0; 
                if (this.counter > 1) return;
            }
        }
    }
    findEmpty(grid) {
        for (let r = 0; r < 9; r++) { for (let c = 0; c < 9; c++) { if (grid[r][c] === 0) return [r, c]; } }
        return null;
    }
    isValid(grid, num, row, col) {
        for (let i = 0; i < 9; i++) { if (grid[row][i] === num && i !== col) return false; }
        for (let i = 0; i < 9; i++) { if (grid[i][col] === num && i !== row) return false; }
        const boxRow = Math.floor(row / 3) * 3; const boxCol = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) { if (grid[boxRow + r][boxCol + c] === num && (boxRow + r !== row || boxCol + c !== col)) return false; } }
        return true;
    }
}


class PuzzleGenerator {
    constructor() {
        this.baseGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
    }

    #shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    #fillGrid(grid) {
        const find = this.#findEmpty(grid);
        if (!find) { return true; }
        const [row, col] = find;
        const numbers = this.#shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
            if (this.#isValid(grid, num, row, col)) {
                grid[row][col] = num;
                if (this.#fillGrid(grid)) { return true; }
                grid[row][col] = 0;
            }
        }
        return false;
    }

    #findEmpty(grid) {
        for (let r = 0; r < 9; r++) { for (let c = 0; c < 9; c++) { if (grid[r][c] === 0) return [r, c]; } }
        return null;
    }

    #isValid(grid, num, row, col) {
        for (let i = 0; i < 9; i++) { if (grid[row][i] === num || grid[i][col] === num) return false; }
        const boxRow = Math.floor(row / 3) * 3; const boxCol = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) { if (grid[boxRow + r][boxCol + c] === num) return false; } }
        return true;
    }

    generate(difficulty) {
        // --- THIS IS THE SECOND CHECKPOINT ---
        console.log('--- SUCCESS! PuzzleGenerator.generate() is running!');
        // -------------------------------------

        const solution = JSON.parse(JSON.stringify(this.baseGrid));
        this.#fillGrid(solution);

        const puzzle = JSON.parse(JSON.stringify(solution));
        const clues = { EASY: 40, MEDIUM: 32, HARD: 25 };
        let cellsToRemove = 81 - (clues[difficulty.toUpperCase()] || 32);
        const positions = this.#shuffle(Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9]));

        for (const [r, c] of positions) {
            if (cellsToRemove === 0) break;
            const backup = puzzle[r][c];
            puzzle[r][c] = 0;
            const tempGrid = JSON.parse(JSON.stringify(puzzle));
            const solver = new SudokuSolver(tempGrid);
            const solutionCount = solver.solve();
            if (solutionCount !== 1) {
                puzzle[r][c] = backup;
            } else {
                cellsToRemove--;
            }
        }
        
        return { puzzle, solution };
    }
}

module.exports = PuzzleGenerator;