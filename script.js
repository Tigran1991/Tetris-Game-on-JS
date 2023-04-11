const container = document.querySelector(".container");
const playBtn = document.querySelector(".play-btn");

const TETROMINO_IDS = ["I", "O", "T", "J", "L", "S", "Z"];

const TETROMINOS = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    O: [
        [1, 1],
        [1, 1],
    ],
    T: [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    J: [
        [0, 0, 1],
        [0, 0, 1],
        [0, 1, 1],
    ],
    L: [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
    ],
    S: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ],
    Z: [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ],
};

const makeGame = () => {
    const createMatrix = () => {
        const initialMatrix = new Array(20).fill();
        const matrix = initialMatrix.map((element) => {
            const row = new Array(10).fill(0);
            return row;
        });

        return matrix;
    };

    const MATRIX = createMatrix();

    const createBoard = () => {
        const board = document.createElement("div");
        board.setAttribute("class", "board");
        container.appendChild(board);
        return board;
    };

    const createCell = () => {
        const cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        return cell;
    };

    const createTetroCell = () => {
        const tetroCell = document.createElement("div");
        tetroCell.setAttribute("class", "tetroCell");
        return tetroCell;
    };

    const renderBoard = (matrix) => {
        const BOARD = createBoard();
        matrix.forEach((row) => {
            row.forEach((rowItem) => {
                if (rowItem === 0) {
                    const CELL = createCell();
                    BOARD.appendChild(CELL);
                } else {
                    const TETRO_CELL = createTetroCell();
                    BOARD.appendChild(TETRO_CELL);
                }
            });
        });
    };

    renderBoard(MATRIX);

    const updateBoard = (matrix) => {
        if (document.querySelector(".board") !== null) {
            document.querySelector(".board").remove();
        }
        renderBoard(matrix);
    };

    const playGame = () => {
        for (let i = 0; i < MATRIX.length; i++) {
            for (let j = 0; j < MATRIX[i].length; j++) {
                if (MATRIX[i][j] === 1) {
                    MATRIX[i][j] = 2;
                }
            }
        }

        const getNewTetromino = () => {
            const checkedTetromino = utils.getRandomTetrominoById();
            let i = 0;
            checkedTetromino.forEach((element) => {
                if (element.includes(1)) {
                    MATRIX[i].splice(4, element.length, element);
                    MATRIX[i] = MATRIX[i].flat();
                    i++;
                }
            });
        };

        getNewTetromino();

        const moveTetrominoBottom = () => {
            const currentCoordinates = [];
            const determineElementsCoordinates = () => {
                for (let i = MATRIX.length - 1; i >= 0; i--) {
                    if (MATRIX[i].includes(1)) {
                        for (let j = 10; j >= 0; j--) {
                            if (MATRIX[i][j] === 1) {
                                currentCoordinates.push({ x: i, y: j });
                                // MATRIX[i][j] = 0;
                                // MATRIX[i + 1][j] = 1;
                            } else {
                                continue;
                            }
                        }
                    }
                }
                return currentCoordinates;
            };

            const tetrominosElementsCoordinates = determineElementsCoordinates();

            const a = tetrominosElementsCoordinates.map((coordinates) => {
                if (
                    coordinates.x + 1 === 20 ||
                    MATRIX[coordinates.x + 1][coordinates.y] === 2
                ) {
                    return true;
                } else {
                    return false;
                }
            });

            if (!a.includes(true)) {
                a.forEach((a1, i) => {
                    MATRIX[currentCoordinates[i].x][
                        tetrominosElementsCoordinates[i].y
                    ] = 0;
                    MATRIX[currentCoordinates[i].x + 1][
                        tetrominosElementsCoordinates[i].y
                    ] = 1;
                });
                determineElementsCoordinates();
            } else {
                clearInterval(interval);
            }

            updateBoard(MATRIX);
        };

        const interval = setInterval(moveTetrominoBottom, 300);

        updateBoard(MATRIX);
    };

    playBtn.addEventListener("click", playGame);
};

makeGame();
