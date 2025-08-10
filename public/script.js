document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const boardElement = document.getElementById('game-board');
    const newGamePanel = document.querySelector('.new-game-panel');
    const messageArea = document.getElementById('message-area');
    const timerElement = document.getElementById('timer');

    // Game state variables
    let gameId = null;
    let selectedCell = null;
    let timerInterval = null;
    const apiBaseUrl = 'http://localhost:3000';

    /**
     * Starts a new game by fetching a puzzle from the server.
     * @param {string} difficulty - The chosen difficulty ('EASY', 'MEDIUM', 'HARD').
     */
    const startNewGame = async (difficulty = 'EASY') => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/games`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ difficulty }),
            });
            const game = await response.json();
            gameId = game.gameId;
            renderBoard(game.board);
            startTimer();
            messageArea.textContent = `New ${difficulty.toLowerCase()} game started!`;
        } catch (error) {
            console.error('Error starting new game:', error);
            messageArea.textContent = 'Failed to connect to the server.';
        }
    };

    /**
     * Renders the Sudoku board based on data from the server.
     * @param {Array<Array<object>>} boardData - The 9x9 grid data.
     */
    const renderBoard = (boardData) => {
        boardElement.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cellData = boardData[r][c];
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (cellData.isGiven) {
                    cell.classList.add('given');
                    cell.textContent = cellData.value;
                } else {
                    cell.classList.add('user-input');
                    cell.textContent = cellData.value > 0 ? cellData.value : '';
                    cell.setAttribute('tabindex', '0');
                }

                if (cellData.isError) {
                    cell.classList.add('error');
                }

                boardElement.appendChild(cell);
            }
        }
    };

    /**
     * Starts the game timer.
     */
    const startTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
        let seconds = 0;
        timerElement.textContent = '00:00';
        timerInterval = setInterval(() => {
            seconds++;
            const min = String(Math.floor(seconds / 60)).padStart(2, '0');
            const sec = String(seconds % 60).padStart(2, '0');
            timerElement.textContent = `${min}:${sec}`;
        }, 1000);
    };

    /**
     * Stops the game timer.
     */
    const stopTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
    };

    // Event listener for clicking on a cell
    boardElement.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('user-input')) {
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            selectedCell = target;
            selectedCell.classList.add('selected');
            selectedCell.focus();
        }
    });

    // Event listener for keyboard input
    document.addEventListener('keydown', async (e) => {
        if (!selectedCell) return;

        const row = selectedCell.dataset.row;
        const col = selectedCell.dataset.col;

        let value = 0;
        if (e.key >= '1' && e.key <= '9') {
            value = parseInt(e.key, 10);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            value = 0; // Clear the cell
        } else {
            return; // Ignore other keys
        }

        try {
            const response = await fetch(`${apiBaseUrl}/api/games/${gameId}/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ row, col, value }),
            });
            const result = await response.json();
            
            if (result.success) {
                renderBoard(result.board);
                // Re-select the cell after re-rendering for a smooth experience
                selectedCell = boardElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
                if(selectedCell) {
                    selectedCell.classList.add('selected');
                    selectedCell.focus();
                }
                
                if (result.isComplete) {
                    messageArea.textContent = 'Congratulations! You solved the puzzle! 🎉';
                    stopTimer();
                }
            } else {
                 messageArea.textContent = result.message || 'An error occurred.';
            }
        } catch (error) {
            console.error('Error submitting move:', error);
        }
    });

    // Event listener for the difficulty buttons
    newGamePanel.addEventListener('click', (e) => {
        if (e.target.classList.contains('difficulty-btn')) {
            const difficulty = e.target.dataset.difficulty;
            startNewGame(difficulty);
        }
    });

    // Start a default easy game when the page first loads
    startNewGame('EASY');
});