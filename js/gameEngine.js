import { Grid, SudokuGenerator } from './gameLogic.js';
import { UIController } from './uiController.js';

/**
 * The main game engine, orchestrating all components.
 */
export class GameEngine {
    constructor() {
        this.generator = new SudokuGenerator();
        this.grid = null;
        this.solution = null;
        this.difficulty = 'easy';
        this.selectedCell = { row: null, col: null };
        this.uiController = new UIController(this);
    }

    init() {
        this.uiController.init();
        this.startGame(this.difficulty);
    }

    startGame(difficulty) {
        this.difficulty = difficulty;
        this.uiController.showLoading();
        
        setTimeout(() => {
            const { puzzle, solution } = this.generator.generatePuzzle(this.difficulty);
            this.grid = new Grid();
            this.grid.fromMatrix(puzzle);
            this.solution = solution;
            this.selectedCell = { row: null, col: null };
            
            this.uiController.renderGrid();
            this.uiController.updateHighlights();
            this.uiController.hideLoading();
        }, 50);
    }
    
    handleCellClick(row, col) {
        this.selectedCell = { row, col };
        this.uiController.updateHighlights();
    }

    handleNumberInput(num) {
        if (this.selectedCell.row === null) return;

        const { row, col } = this.selectedCell;
        const cell = this.grid.cells[row][col];

        if (cell.isGiven) return;

        cell.value = num;
        this._updateErrors();
        
        this.uiController.renderGrid();
        this.uiController.updateHighlights();

        if (this._isGridFull() && this._isSolutionCorrect()) {
            this.uiController.showWinModal();
        }
    }
    
    _updateErrors() {
        // Clear all previous errors
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                this.grid.cells[r][c].isError = false;
            }
        }

        // Find new errors
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = this.grid.cells[r][c];
                if (cell.value !== 0 && !cell.isGiven) {
                    if (cell.value !== this.solution[r][c]) {
                        cell.isError = true;
                    }
                }
            }
        }
    }

    _isGridFull() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.grid.cells[r][c].value === 0) return false;
            }
        }
        return true;
    }

    _isSolutionCorrect() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.grid.cells[r][c].value !== this.solution[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }
}
