const NumRows = 9;
const NumCols = 9;
const NumMines = 10;
let board = [];

function initializeBoard() {
    for (let row = 0; row < NumRows; row++) {
        board[row] = [];
        for (let col = 0; col < NumCols; col++) {
            board[row][col] = {
                isMine: false,
                isRevealed: false,
                count: 0
            }
        }
    }
    //Mine the board randomly;

    let mines = 0;
    while (mines < NumRows) {
        const randomRow = Math.floor(Math.random() * NumRows)
        const randomCol = Math.floor(Math.random() * NumCols)

        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true;
            mines++;
        }
    }

    for (let row = 0; row < NumRows; row++) {
        for (let col = 0; col < NumCols; col++) {
            if (!board[row][col].isMine) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const iLoc = row + dx;
                        const jLoc = col + dy;

                        if (
                            iLoc >= 0 && iLoc < NumRows &&
                            jLoc >= 0 && jLoc < NumCols &&
                            board[iLoc][jLoc].isMine
                        )
                            count++;
                    }
                }
                board[row][col].count = count;
            }
        }
    }


}

const gameBoard = document.getElementById("game-board")
function render() {
    gameBoard.innerHTML = " ";
    for (let row = 0; row < NumRows; row++) {
        for (let col = 0; col < NumCols; col++) {
            const tile = document.createElement("div")
            tile.className = "tile";
            if (board[row][col].isRevealed) {

                tile.classList.add("revealed");
                if (board[row][col].isMine) {
                    tile.classList.add("bomb");
                    tile.innerText = '💣';
                }
                else if (board[row][col].count > 0) {
                    tile.innerText = board[row][col].count;
                }
            }



            tile.addEventListener('click', () => revealTime(row, col));
            gameBoard.appendChild(tile);

        }
        gameBoard.appendChild(document.createElement('br'));
    }
}

function revealTime(row, col) {
    if (
        row >= 0 && row < NumRows &&
        col >= 0 && col < NumCols &&
        !board[row][col].isRevealed
    ) {
        board[row][col].isRevealed = true;

        if (board[row][col].isMine) {
            alert('Game over!! You Stepped on a mine!');
            const resultMessage = document.getElementById('message');
            resultMessage.textContent = 'Sorry, you didn\'t win. Try again!';
            resultMessage.style.color = 'red';
        }
        if (board[row][col].count === 0) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    revealTime(row + dx, col + dy);
                }
            }
        }
        render();
    }
}
initializeBoard();
render();
document.getElementById('myButton').addEventListener('click', reset);
function reset() {
    initializeBoard();
    render();
    const curry = document.querySelectorAll('.tile');
    let color = getRandomColor();
    curry.forEach(ele => {
        ele.style.backgroundColor = color;
    })
    document.getElementById('message').textContent = '';
}


document.getElementById('myButton').addEventListener('click', function () {

});

function getRandomColor() {
    const letters = 'abcdef';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
    }
    return color;
}

console.log(board);