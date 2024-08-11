const X = "X";
const O = "O";
const EMPTY = null;

function initialState() {
    return [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];
}

function player(board) {
    let xCount = 0, oCount = 0;

    for (let row of board) {
        for (let cell of row) {
            if (cell === X) xCount++;
            else if (cell === O) oCount++;
        }
    }

    return xCount <= oCount ? X : O;
}

function actions(board) {
    const result = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === EMPTY) result.push([i, j]);
        }
    }

    return result;
}

function result(board, action) {
    const newBoard = board.map(row => row.slice());
    const [row, col] = action;
    newBoard[row][col] = player(board);
    return newBoard;
}

function winner(board) {
    for (let row of board) {
        if (row[0] === row[1] && row[1] === row[2] && row[0] !== EMPTY) {
            return row[0];
        }
    }

    for (let col = 0; col < 3; col++) {
        if (board[0][col] === board[1][col] && board[1][col] === board[2][col] && board[0][col] !== EMPTY) {
            return board[0][col];
        }
    }

    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== EMPTY) {
        return board[0][0];
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== EMPTY) {
        return board[0][2];
    }

    return null;
}

function terminal(board) {
    return winner(board) !== null || actions(board).length === 0;
}

function utility(board) {
    const win = winner(board);
    if (win === X) return 1;
    else if (win === O) return -1;
    return 0;
}

function minimax(board) {
    if (terminal(board)) return null;

    const currPlayer = player(board);
    let bestMove = null;

    if (currPlayer === X) {
        let bestValue = -Infinity;
        for (let action of actions(board)) {
            const value = minValue(result(board, action));
            if (value > bestValue) {
                bestValue = value;
                bestMove = action;
            }
        }
    } else {
        let bestValue = Infinity;
        for (let action of actions(board)) {
            const value = maxValue(result(board, action));
            if (value < bestValue) {
                bestValue = value;
                bestMove = action;
            }
        }
    }

    return bestMove;
}

function maxValue(board) {
    if (terminal(board)) return utility(board);

    let v = -Infinity;
    for (let action of actions(board)) {
        v = Math.max(v, minValue(result(board, action)));
    }
    return v;
}

function minValue(board) {
    if (terminal(board)) return utility(board);

    let v = Infinity;
    for (let action of actions(board)) {
        v = Math.min(v, maxValue(result(board, action)));
    }
    return v;
}



let board = initialState();
const boardElement = document.getElementById('board');

function render() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = board[i][j];
            cell.onclick = () => handleMove(i, j);
            boardElement.appendChild(cell);
        }
    }
}

function handleMove(i, j) {
    if (board[i][j] !== EMPTY || terminal(board)) return;

    board = result(board, [i, j]);
    render();

    if (!terminal(board)) {
        const aiMove = minimax(board);
        board = result(board, aiMove);
        render();
    }

    if (terminal(board)) {
        const winnerPlayer = winner(board);
        const resultElement = document.getElementById('result');
        if (winnerPlayer) {
            resultElement.textContent = `Player ${winnerPlayer} wins!`;
        } else {
            resultElement.textContent = 'Draw!';
        }
    }
}

function resetGame() {
    document.getElementById('result').textContent = '';
    board = initialState();
    render();
}

// Initial render
render();

