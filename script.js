
const NumRows = 9;
const NumCols = 9;
const NumMines = 10;
const clickCount = document.querySelector("#time-elapsed");
let startTime ;
let elapsedTime = 0;
let timerInterval;

let count = 0;
let board = [];
const audio = new Audio('StockTune-Evening Heartfelt Echoes_1723328385.mp3');
const smiley = document.getElementById('smiley');
function initializeBoard() {
    audio.play();
    for (let row = 0; row < NumRows; row++) {
        board[row] = [];
        for (let col = 0; col < NumCols; col++) {
            board[row][col] = {
                isMine: false,
                isRevealed: false,
                count: 0,
                isMarked: false
            }
        }
    }

    // Mine the board randomly
    let mines = 0;
    while (mines < NumMines) {
        const randomRow = Math.floor(Math.random() * NumRows);
        const randomCol = Math.floor(Math.random() * NumCols);

        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true;
            mines++;
        }
    }

    // Calculate adjacent mine counts
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
                        ) {
                            count++;
                        }
                    }
                }
                board[row][col].count = count;
            }
        }
    }
}

const gameBoard = document.getElementById("game-board");

function render() {
    audio.play();
    gameBoard.innerHTML = "";
    for (let row = 0; row < NumRows; row++) {
        for (let col = 0; col < NumCols; col++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.dataset.row = row;
            tile.dataset.col = col;
            if (board[row][col].isRevealed) {
                tile.classList.add("revealed");
                if (board[row][col].isMine) {
                    tile.classList.add("bomb");
                    tile.innerText = '💣';
                } else if (board[row][col].count > 0) {
                    tile.innerText = board[row][col].count;
                }
            } else if (board[row][col].isMarked) {
                tile.classList.add("marked");
                tile.innerText = '🚩';
            }

            tile.addEventListener('click', () => {
                count++;
                updateClickCount();
                revealTile(row, col);
            });
            tile.addEventListener('contextmenu', (event) => {
                count++;
                updateClickCount();
                event.preventDefault();
                toggleMark(row, col);
            });

            gameBoard.appendChild(tile);
        }
    }
}

function revealTile(row, col) {

    if (
        row >= 0 && row < NumRows &&
        col >= 0 && col < NumCols &&
        !board[row][col].isRevealed &&
        !board[row][col].isMarked
    ) {
        board[row][col].isRevealed = true;
        if (board[row][col].isMine) {
            playExplosion();
            gameOver();
        } else if (board[row][col].count === 0) {
            // Reveal adjacent tiles recursively if count is 0
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    revealTile(row + dx, col + dy);
                }
            }
        }
        render();
        checkWin();
    }
}

function toggleMark(row, col) {
    if (!board[row][col].isRevealed) {
        board[row][col].isMarked = !board[row][col].isMarked;
        render();
    }
}

function checkWin() {
    let revealedCount = 0;
    let correctlyMarkedCount = 0;

    for (let row = 0; row < NumRows; row++) {
        for (let col = 0; col < NumCols; col++) {
            if (board[row][col].isRevealed) {
                revealedCount++;
            }
            if (board[row][col].isMarked && board[row][col].isMine) {
                correctlyMarkedCount++;
            }
        }
    }

    if (revealedCount === (NumRows * NumCols) - NumMines || correctlyMarkedCount === NumMines) {
        document.getElementById("message").innerText = "You Win!";
        stopTimer();
    }
}

function gameOver() {
    audio.pause();
    smiley.innerText = "😒";
    for (let row = 0; row < NumRows; row++) {
        for (let col = 0; col < NumCols; col++) {
            board[row][col].isRevealed = true;
        }
    }

    render();
    document.getElementById("message").innerText = "Game Over!";
    stopTimer();
}

document.getElementById("reset-button").addEventListener("click", function () {
    startNewGame();
});

document.getElementById("myButton").addEventListener("click", function () {
    startNewGame();
});

function startNewGame() {
    smiley.innerText = "😊";
    audio.play();
    board = [];
    initializeBoard();
    render();
    document.getElementById("message").innerText = "";
    count = 0;
    elapsedTime = 0;
    updateClickCount();
    startTimer();
}

function playExplosion() {
    const audio = new Audio('explosion-under-snow-sfx-230505.mp3');
    audio.play();
}

//total click winning
function updateClickCount() {
    clickCount.innerText = count;
}


//handle timing
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
        document.getElementById("mines-left").innerText = elapsedTime ;
    }, 1000); // Update every second
}

function stopTimer() {
    clearInterval(timerInterval);
}


// Start the game
startNewGame();