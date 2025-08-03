document.addEventListener('DOMContentLoaded', () => {
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
            });
            const game = await response.json();
            gameId = game.gameId;
            renderBoard(game.board);
            startTimer();
            messageArea.textContent = '';
        } catch (error) {
            console.error('Error starting new game:', error);
            messageArea.textContent = 'Failed to start a new game.';
        }
    };

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
                    cell.setAttribute('tabindex', '0'); // Make it focusable
                }

                if (cellData.isError) {
                    cell.classList.add('error');
                }

                boardElement.appendChild(cell);
            }
        }
    };

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

    const stopTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
    };

    boardElement.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('user-input')) {
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            selectedCell = target;
            selectedCell.classList.add('selected');
        }
    });

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
            const response = await fetch(`/api/games/${gameId}/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ row, col, value }),
            });
            const result = await response.json();

            if (result.success) {
                renderBoard(result.board);
                // Re-select the cell after re-render
                selectedCell = boardElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
                if(selectedCell) selectedCell.classList.add('selected');

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

    newGameBtn.addEventListener('click', startNewGame);

    // Start a game on page load
    startNewGame();
});