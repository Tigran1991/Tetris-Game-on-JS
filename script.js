const container = document.querySelector(".container");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const resumeBtn = document.querySelector(".resume-btn");

const GAME_SETTINGS = {
    rangeOfIds: [0, 6],
    lengthOfMatrix: 20,
    lengthOfRows: 10,
    emptyCellsValue: 0,
    tetroCellsValue: 1,
    doneTetroCellsValue: 2,
    tetroMoveingInterval: 300,
};

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
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ],
    L: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
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

const getRandomId = (min, max) => Math.floor(Math.random() * (max - min) + min);

const getRandomTetrominoById = () => {
    const index = getRandomId(
        GAME_SETTINGS.rangeOfIds[0],
        GAME_SETTINGS.rangeOfIds[1]
    );
    const checkedId = TETROMINO_IDS[index];
    return TETROMINOS[checkedId];
};

const createMatrix = () => {
    const initialMatrix = new Array(GAME_SETTINGS.lengthOfMatrix).fill();
    const matrix = initialMatrix.map((element) => {
        const row = new Array(GAME_SETTINGS.lengthOfRows).fill(
            GAME_SETTINGS.emptyCellsValue
        );
        return row;
    });

    return matrix;
};

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

const renderBoard = (matrix, board) => {
    matrix.forEach((row) => {
        row.forEach((rowItem) => {
            if (rowItem === GAME_SETTINGS.emptyCellsValue) {
                const CELL = createCell();
                board.appendChild(CELL);
            } else if (
                rowItem === GAME_SETTINGS.tetroCellsValue ||
                rowItem === GAME_SETTINGS.doneTetroCellsValue
            ) {
                const TETRO_CELL = createTetroCell();
                board.appendChild(TETRO_CELL);
            }
        });
    });
};

const updateBoard = (matrix) => {
    if (document.querySelector(".board") !== null) {
        document.querySelector(".board").remove();
    }
    const BOARD = createBoard();
    renderBoard(matrix, BOARD);
};

const getNewTetromino = (matrix) => {
    const checkedTetromino = getRandomTetrominoById();
    let i = 0;
    checkedTetromino.forEach((element) => {
        if (element.includes(1)) {
            matrix[i].splice(4, element.length, element);
            console.log(matrix);
            matrix[i] = matrix[i].flat();
            i++;
        }
    });

    return checkedTetromino;
};

const getTetrominoCoordinates = (matrix) => {
    const currentCoordinates = [];
    for (let i = matrix.length - 1; i >= 0; i--) {
        if (matrix[i].includes(1)) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === 1) {
                    currentCoordinates.push({ x: i, y: j });
                }
            }
        }
    }
    return currentCoordinates;
};

const rotateTetrominoToRight = (tetromino) => {
    const updatedTetromino = [];
    for (let i = 0; i < tetromino.length; i++) {
        updatedTetromino.push([]);
    }
    let k = 0;
    for (let i = tetromino.length - 1; i >= 0; i--) {
        for (let j = 0; j < tetromino[i].length; j++) {
            updatedTetromino[j][k] = tetromino[i][j];
        }
        k++;
    }

    return updatedTetromino;
};

const makeNewTetrominoMovement = (matrix) => {
    let currentTetromino = getNewTetromino(matrix);
    updateBoard(matrix);

    const moveTetrominoBottom = (matrix) => {
        const tetrominosElementsCoordinates = getTetrominoCoordinates(matrix);

        const checkMovementAbilityOptions = tetrominosElementsCoordinates.map(
            (coordinates) => {
                if (
                    coordinates.x + 1 === matrix.length ||
                    matrix[coordinates.x + 1][coordinates.y] ===
                        GAME_SETTINGS.doneTetroCellsValue
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        );

        const updateMatrixAfterMoveing = () => {
            if (!checkMovementAbilityOptions.includes(true)) {
                tetrominosElementsCoordinates.forEach((movement) => {
                    matrix[movement.x][movement.y] =
                        GAME_SETTINGS.emptyCellsValue;
                    matrix[movement.x + 1][movement.y] =
                        GAME_SETTINGS.tetroCellsValue;
                });
            } else {
                for (let i = 0; i < matrix.length; i++)
                    for (let j = 0; j < matrix[i].length; j++)
                        if (matrix[i][j] === GAME_SETTINGS.tetroCellsValue)
                            matrix[i][j] = GAME_SETTINGS.doneTetroCellsValue;

                clearInterval(interval);
                document.removeEventListener("keydown", handleKeyboardEvents);
                makeNewTetrominoMovement(matrix);
            }
        };

        updateMatrixAfterMoveing();
        updateBoard(matrix);
    };

    let interval = setInterval(() => moveTetrominoBottom(matrix), 1000);

    const handleKeyboardEvents = (e) => {
        const tetrominosElementsCoordinates = getTetrominoCoordinates(matrix);
        if (e.key === "ArrowLeft") {
            const tetrominoMovementAbilityOptions =
                tetrominosElementsCoordinates.map((coordinates) => {
                    if (
                        coordinates.y - 1 === -1 ||
                        matrix[coordinates.x][coordinates.y - 1] ===
                            GAME_SETTINGS.doneTetroCellsValue
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                });

            if (!tetrominoMovementAbilityOptions.includes(true)) {
                tetrominosElementsCoordinates.forEach((movement) => {
                    matrix[movement.x][movement.y] =
                        GAME_SETTINGS.emptyCellsValue;
                    matrix[movement.x][movement.y - 1] =
                        GAME_SETTINGS.tetroCellsValue;
                });
            }
        } else if (e.key === "ArrowUp") {
            const tetrominoMovementAbilityOptions =
                tetrominosElementsCoordinates.map((coordinates) => {
                    if (
                        coordinates.x + 1 === GAME_SETTINGS.lengthOfMatrix ||
                        matrix[coordinates.x + 1][coordinates.y] ===
                            GAME_SETTINGS.doneTetroCellsValue ||
                        coordinates.y - 1 === -1 ||
                        matrix[coordinates.x][coordinates.y - 1] ===
                            GAME_SETTINGS.doneTetroCellsValue ||
                        coordinates.y + 1 === 10 ||
                        matrix[coordinates.x][coordinates.y + 1] ===
                            GAME_SETTINGS.doneTetroCellsValue
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                });

            if (!tetrominoMovementAbilityOptions.includes(true)) {
                let tetrominoCurrentXPosition;
                let tetrominoCurrentYPosition;
                for (let i = 0; i < matrix.length; i++) {
                    for (let j = 0; j < matrix[i].length; j++) {
                        if (matrix[i][j] === GAME_SETTINGS.tetroCellsValue) {
                            tetrominoCurrentXPosition = i - 1;
                            tetrominoCurrentYPosition = j - 1;
                            matrix[i][j] = GAME_SETTINGS.emptyCellsValue;
                        }
                    }
                }

                currentTetromino = rotateTetrominoToRight(currentTetromino);

                let i = tetrominoCurrentXPosition;

                currentTetromino.forEach((element) => {
                    if (element.includes(GAME_SETTINGS.tetroCellsValue)) {
                        matrix[i].splice(
                            tetrominoCurrentYPosition,
                            element.length,
                            element
                        );
                        matrix[i] = matrix[i].flat();
                        i++;
                    }
                });
            }
        } else if (e.key === "ArrowRight") {
            const tetrominoMovementAbilityOptions =
                tetrominosElementsCoordinates.map((coordinates) => {
                    if (
                        coordinates.y + 1 === GAME_SETTINGS.lengthOfRows ||
                        matrix[coordinates.x][coordinates.y + 1] ===
                            GAME_SETTINGS.doneTetroCellsValue
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                });

            if (!tetrominoMovementAbilityOptions.includes(true)) {
                tetrominosElementsCoordinates.reverse().forEach((movement) => {
                    matrix[movement.x][movement.y] =
                        GAME_SETTINGS.emptyCellsValue;
                    matrix[movement.x][movement.y + 1] =
                        GAME_SETTINGS.tetroCellsValue;
                });
            }
        }

        updateBoard(matrix);
    };

    document.addEventListener("keydown", handleKeyboardEvents);
};

const playGame = (matrix) => {
    makeNewTetrominoMovement(matrix);
};

const makeGame = () => {
    const MATRIX = createMatrix();
    const BOARD = createBoard();
    renderBoard(MATRIX, BOARD);

    playBtn.addEventListener("click", () => playGame(MATRIX));
};

makeGame();
