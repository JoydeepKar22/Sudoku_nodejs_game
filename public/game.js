document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
    const boardElement = document.getElementById('game-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const messageArea = document.getElementById('message-area');
    const timerElement = document.getElementById('timer');

    let gameId = null;
    let selectedCell = null;
    let timerInterval = null;

    const startNewGame = async () => {
        try {
            const response = await fetch('/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ difficulty: 'EASY' }),
=======
    // Get references to HTML elements
    const boardElement = document.getElementById('game-board');
    const newGamePanel = document.querySelector('.new-game-panel');
    const messageArea = document.getElementById('message-area');
    const timerElement = document.getElementById('timer');

    // Game state variables
    let gameId = null;
    let selectedCell = null;
    let timerInterval = null;
    const apiBaseUrl = '';

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
>>>>>>> 81539fb (Final project setup)
            });
            const game = await response.json();
            gameId = game.gameId;
            renderBoard(game.board);
            startTimer();
<<<<<<< HEAD
            messageArea.textContent = '';
        } catch (error) {
            console.error('Error starting new game:', error);
            messageArea.textContent = 'Failed to start a new game.';
        }
    };

=======
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
>>>>>>> 81539fb (Final project setup)
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
<<<<<<< HEAD
                    cell.setAttribute('tabindex', '0'); // Make it focusable
=======
                    cell.setAttribute('tabindex', '0');
>>>>>>> 81539fb (Final project setup)
                }

                if (cellData.isError) {
                    cell.classList.add('error');
                }

                boardElement.appendChild(cell);
            }
        }
    };

<<<<<<< HEAD
=======
    /**
     * Starts the game timer.
     */
>>>>>>> 81539fb (Final project setup)
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

<<<<<<< HEAD
=======
    /**
     * Stops the game timer.
     */
>>>>>>> 81539fb (Final project setup)
    const stopTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
    };

<<<<<<< HEAD
=======
    // Event listener for clicking on a cell
>>>>>>> 81539fb (Final project setup)
    boardElement.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('user-input')) {
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            selectedCell = target;
            selectedCell.classList.add('selected');
<<<<<<< HEAD
        }
    });

=======
            selectedCell.focus();
        }
    });

    // Event listener for keyboard input
>>>>>>> 81539fb (Final project setup)
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
<<<<<<< HEAD
            const response = await fetch(`/api/games/${gameId}/move`, {
=======
            const response = await fetch(`${apiBaseUrl}/api/games/${gameId}/move`, {
>>>>>>> 81539fb (Final project setup)
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ row, col, value }),
            });
            const result = await response.json();
<<<<<<< HEAD

            if (result.success) {
                renderBoard(result.board);
                // Re-select the cell after re-render
                selectedCell = boardElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
                if(selectedCell) selectedCell.classList.add('selected');

=======
            
            if (result.success) {
                renderBoard(result.board);
                // Re-select the cell after re-rendering for a smooth experience
                selectedCell = boardElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
                if(selectedCell) {
                    selectedCell.classList.add('selected');
                    selectedCell.focus();
                }
                
>>>>>>> 81539fb (Final project setup)
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

<<<<<<< HEAD
    newGameBtn.addEventListener('click', startNewGame);

    // Start a game on page load
    startNewGame();
=======
    // Event listener for the difficulty buttons
    newGamePanel.addEventListener('click', (e) => {
        if (e.target.classList.contains('difficulty-btn')) {
            const difficulty = e.target.dataset.difficulty;
            startNewGame(difficulty);
        }
    });

    // Start a default easy game when the page first loads
    startNewGame('EASY');
>>>>>>> 81539fb (Final project setup)
});