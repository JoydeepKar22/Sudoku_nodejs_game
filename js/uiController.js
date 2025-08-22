export class UIController {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.gridElement = document.getElementById('sudoku-grid');
        this.numberPadElement = document.getElementById('number-pad');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.winModal = document.getElementById('win-modal');
        this.activeDifficultyBtn = document.querySelector('.difficulty-btn[data-difficulty="easy"]');
    }

    init() {
        this._setupEventListeners();
        this._createNumberPad();
    }

    _setupEventListeners() {
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this._handleDifficultyClick(e));
        });

        // New Game buttons
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.gameEngine.startGame(this.gameEngine.difficulty);
        });
        document.getElementById('modal-new-game-btn').addEventListener('click', () => {
            this.hideWinModal();
            this.gameEngine.startGame(this.gameEngine.difficulty);
        });

        // Grid clicks
        this.gridElement.addEventListener('click', (e) => {
            const cell = e.target.closest('.sudoku-cell');
            if (cell) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.gameEngine.handleCellClick(row, col);
            }
        });
        
        // Number pad clicks
        this.numberPadElement.addEventListener('click', (e) => {
            const button = e.target.closest('.num-btn');
            if (button) {
                const num = parseInt(button.dataset.num);
                this.gameEngine.handleNumberInput(num);
            }
        });
    }
    
    _handleDifficultyClick(e) {
        const newDifficulty = e.target.dataset.difficulty;
        if (this.gameEngine.difficulty === newDifficulty) return;

        this.gameEngine.difficulty = newDifficulty;
        
        // Update button styles
        if (this.activeDifficultyBtn) {
            this.activeDifficultyBtn.classList.remove('bg-blue-500', 'text-white');
            this.activeDifficultyBtn.classList.add('bg-gray-200', 'text-gray-700');
        }
        e.target.classList.add('bg-blue-500', 'text-white');
        e.target.classList.remove('bg-gray-200', 'text-gray-700');
        this.activeDifficultyBtn = e.target;

        this.gameEngine.startGame(newDifficulty);
    }

    _createNumberPad() {
        this.numberPadElement.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.dataset.num = i;
            btn.className = 'num-btn text-xl font-semibold bg-gray-200 text-gray-800 rounded-md p-2 hover:bg-blue-200 transition duration-200 aspect-square';
            this.numberPadElement.appendChild(btn);
        }
        const eraseBtn = document.createElement('button');
        eraseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
        eraseBtn.dataset.num = 0;
        eraseBtn.className = 'num-btn bg-red-200 text-red-700 rounded-md p-2 hover:bg-red-300 transition duration-200 aspect-square';
        this.numberPadElement.appendChild(eraseBtn);
    }

    renderGrid() {
        this.gridElement.innerHTML = '';
        const grid = this.gameEngine.grid;
        if (!grid) return;

        for (let r = 0; r < 9; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'sudoku-row contents'; // 'contents' makes it behave like its children are direct children of the grid
            for (let c = 0; c < 9; c++) {
                const cellData = grid.cells[r][c];
                const cellDiv = document.createElement('div');
                cellDiv.dataset.row = r;
                cellDiv.dataset.col = c;
                
                let classes = 'sudoku-cell flex items-center justify-center text-2xl font-bold border-r border-b border-gray-300 cursor-pointer transition-colors duration-200';
                
                if (cellData.isGiven) {
                    classes += ' given bg-gray-200 text-gray-900';
                } else {
                    classes += ' text-blue-600';
                }
                
                if(cellData.isError) {
                    classes += ' error';
                }

                cellDiv.className = classes;
                cellDiv.textContent = cellData.value === 0 ? '' : cellData.value;
                rowDiv.appendChild(cellDiv);
            }
            this.gridElement.appendChild(rowDiv);
        }
    }

    updateHighlights() {
        // Remove all current highlights
        document.querySelectorAll('.sudoku-cell').forEach(c => {
            c.classList.remove('selected', 'highlighted');
        });

        const { row, col } = this.gameEngine.selectedCell;
        if (row === null) return;

        // Highlight selected cell, row, col, and box
        for (let i = 0; i < 9; i++) {
            this.getCellElement(row, i)?.classList.add('highlighted');
            this.getCellElement(i, col)?.classList.add('highlighted');
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r_offset = 0; r_offset < 3; r_offset++) {
            for (let c_offset = 0; c_offset < 3; c_offset++) {
                this.getCellElement(startRow + r_offset, startCol + c_offset)?.classList.add('highlighted');
            }
        }
        
        // Apply selected style
        this.getCellElement(row, col)?.classList.add('selected');
    }

    getCellElement(row, col) {
        return this.gridElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
    }

    showLoading() { this.loadingSpinner.classList.remove('hidden'); }
    hideLoading() { this.loadingSpinner.classList.add('hidden'); }
    showWinModal() { this.winModal.classList.remove('hidden'); }
    hideWinModal() { this.winModal.classList.add('hidden'); }
}
