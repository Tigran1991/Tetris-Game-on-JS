const container = document.querySelector(".container");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const resumeBtn = document.querySelector(".resume-btn");

const GAME_SETTINGS = {
    rangeOfIndex: [0, 6],
    lengthOfMatrix: 20,
    lengthOfRows: 10,
    emptyCellsValue: 0,
    tetroCellsValue: 1,
    doneTetroCellsValue: 2,
    step: 1,
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

const generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

const getRandomTetromino = (index) => {
    const checkedId = TETROMINO_IDS[index];
    return TETROMINOS[checkedId];
};

const addNewtetrominoToMatrix = (matrix, initialTetromino) => {
    const tetromino = initialTetromino.filter((row) => row.includes(1));
    tetromino.forEach((element, i) => {
        matrix[i].splice(4, element.length, element);
        matrix[i] = matrix[i].flat();
    });
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

const createGameStatusBoard = (gameStatusText) => {
    const gameStatusBoard = document.createElement("div");
    gameStatusBoard.setAttribute("class", "game-board");
    container.appendChild(gameStatusBoard);
    const text = document.createElement("h3");
    text.innerText = gameStatusText;
    gameStatusBoard.appendChild(text);
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

const getTetrominoCurrentCoordinates = (matrix) => {
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

const getTetrominoNewCoordinates = (currentCoordinates) => {
    const newCoordinates = currentCoordinates.map((coordinates) => {
        const updatedCoordinates = {};
        updatedCoordinates.x = coordinates.x + GAME_SETTINGS.step;
        updatedCoordinates.y = coordinates.y;
        return updatedCoordinates;
    });

    return newCoordinates;
};

const getTetrominoNewCoordinatesAfterMoveingLeft = (currentCoordinates) => {
    const newCoordinates = currentCoordinates.map((coordinates) => {
        const updatedCoordinates = {};
        updatedCoordinates.x = coordinates.x;
        if (coordinates.y - 1 >= 0) {
            updatedCoordinates.y = coordinates.y - 1;
        } else {
            updatedCoordinates.y = undefined;
        }
        return updatedCoordinates;
    });

    return newCoordinates;
};

const getTetrominoNewCoordinatesAfterMoveingRight = (currentCoordinates) => {
    const newCoordinates = currentCoordinates.map((coordinates) => {
        const updatedCoordinates = {};
        updatedCoordinates.x = coordinates.x;
        if (coordinates.y + 1 < GAME_SETTINGS.lengthOfRows) {
            updatedCoordinates.y = coordinates.y + 1;
        } else {
            updatedCoordinates.y = undefined;
        }
        return updatedCoordinates;
    });

    return newCoordinates;
};

const isTetrominoCanMove = (matrix, newCoordinates) => {
    const tetrominoMovementAbility = newCoordinates.map((coordinate) => {
        if (
            coordinate.x !== matrix.length &&
            matrix[coordinate.x][coordinate.y] !== 2
        ) {
            return true;
        } else {
            return false;
        }
    });

    if (!tetrominoMovementAbility.includes(false)) {
        return true;
    } else {
        return false;
    }
};

const isTetrominoCanMoveLeft = (matrix, newCoordinates) => {
    const tetrominoMovementAbility = newCoordinates.map((coordinate) => {
        if (
            coordinate.y !== undefined ||
            matrix[coordinate.x][coordinate.y - 1] ===
                GAME_SETTINGS.doneTetroCellsValue
        ) {
            return true;
        } else {
            return false;
        }
    });

    if (!tetrominoMovementAbility.includes(false)) {
        return true;
    } else {
        return false;
    }
};

const isTetrominoCanMoveRight = (matrix, newCoordinates) => {
    const tetrominoMovementAbility = newCoordinates.map((coordinate) => {
        if (
            coordinate.y !== undefined ||
            matrix[coordinate.x][coordinate.y + 1] ===
                GAME_SETTINGS.doneTetroCellsValue
        ) {
            return true;
        } else {
            return false;
        }
    });

    if (!tetrominoMovementAbility.includes(false)) {
        return true;
    } else {
        return false;
    }
};

const rotateTetromino = (tetromino) => {
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

const isTetrominoCanRotate = () => {
    const tetrominoRotateAbility = newCoordinates.map((coordinate) => {
        if (
            coordinate.y !== undefined ||
            matrix[coordinate.x][coordinate.y + 1] ===
                GAME_SETTINGS.doneTetroCellsValue
        ) {
            return true;
        } else {
            return false;
        }
    });

    if (!tetrominoMovementAbility.includes(false)) {
        return true;
    } else {
        return false;
    }
};

const moveTetrominoLeft = (matrix, tetrominoCurrentCoordinates) => {
    const tetrominoNewCoordinates = getTetrominoNewCoordinatesAfterMoveingLeft(
        tetrominoCurrentCoordinates
    );
    const canMoveLeft = isTetrominoCanMoveLeft(matrix, tetrominoNewCoordinates);
    if (canMoveLeft) {
        tetrominoCurrentCoordinates.forEach((coordinate) => {
            matrix[coordinate.x][coordinate.y] = GAME_SETTINGS.emptyCellsValue;
        });
        tetrominoNewCoordinates.forEach((coordinate) => {
            matrix[coordinate.x][coordinate.y] = GAME_SETTINGS.tetroCellsValue;
        });
    }
};

const moveTetrominoRight = (matrix, tetrominoCurrentCoordinates) => {
    const tetrominoNewCoordinates = getTetrominoNewCoordinatesAfterMoveingRight(
        tetrominoCurrentCoordinates
    );
    const canMoveRight = isTetrominoCanMoveRight(
        matrix,
        tetrominoNewCoordinates
    );
    if (canMoveRight) {
        tetrominoCurrentCoordinates.forEach((coordinate) => {
            matrix[coordinate.x][coordinate.y] = GAME_SETTINGS.emptyCellsValue;
        });
        tetrominoNewCoordinates.forEach((coordinate) => {
            matrix[coordinate.x][coordinate.y] = GAME_SETTINGS.tetroCellsValue;
        });
    }
};

const moveTetrominoBottom = (matrix, board, interval) => {
    const tetrominoCurrentCoordinates = getTetrominoCurrentCoordinates(matrix);
    const tetrominoNewCoordinates = getTetrominoNewCoordinates(
        tetrominoCurrentCoordinates
    );
    const canMove = isTetrominoCanMove(matrix, tetrominoNewCoordinates);
    if (canMove) {
        tetrominoCurrentCoordinates.forEach((coordinates) => {
            matrix[coordinates.x][coordinates.y] =
                GAME_SETTINGS.emptyCellsValue;
        });
        tetrominoNewCoordinates.forEach((coordinates) => {
            matrix[coordinates.x][coordinates.y] =
                GAME_SETTINGS.tetroCellsValue;
        });
    } else {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === GAME_SETTINGS.tetroCellsValue) {
                    matrix[i][j] = GAME_SETTINGS.doneTetroCellsValue;
                }
            }
        }
        clearInterval(interval);
        document.removeEventListener("keydown", handleKeyboardEvents);
        makeNewTetrominoMovement(matrix, board);
    }
};

const checkRowItems = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].includes(2) && matrix[i].every((item) => item === 2)) {
            matrix.splice(i, 1);
            matrix.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            updateBoard(matrix);
        }
    }
};

const makeNewTetrominoMovement = (matrix, board) => {
    // if (matrix.every((row) => row.includes(2))) {
    //     createGameStatusBoard("GAME OVER !");
    //     return false;
    // } else if (quantity === 10) {
    //     createGameStatusBoard("YOU WIN !");
    //     return false;
    // }

    // quantity++;

    // let k = 4;

    // checkRowItems(matrix);
    const randomIndex = generateRandomNumber(
        GAME_SETTINGS.rangeOfIndex[0],
        GAME_SETTINGS.rangeOfIndex[1]
    );
    const currentTetromino = getRandomTetromino(randomIndex);
    addNewtetrominoToMatrix(matrix, currentTetromino);
    updateBoard(matrix);

    let interval = setInterval(() => {
        moveTetrominoBottom(matrix, board, interval);
        updateBoard(matrix);
    }, GAME_SETTINGS.tetroMoveingInterval);
    document.addEventListener("keydown", (e) =>
        handleKeyboardEvents(e, matrix)
    );
};

const handleKeyboardEvents = (e, matrix) => {
    const tetrominoCurrentCoordinates = getTetrominoCurrentCoordinates(matrix);
    if (e.key === "ArrowLeft") {
        moveTetrominoLeft(matrix, tetrominoCurrentCoordinates);
    } else if (e.key === "ArrowUp") {
        const tetrominoMovementAbilityOptions =
            tetrominosElementsCoordinates.map((coordinates) => {
                if (
                    coordinates.x + 1 === GAME_SETTINGS.lengthOfMatrix ||
                    matrix[coordinates.x + 1][coordinates.y] ===
                        GAME_SETTINGS.doneTetroCellsValue ||
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
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    if (matrix[i][j] === GAME_SETTINGS.tetroCellsValue) {
                        tetrominoCurrentXPosition = i - 1;
                        matrix[i][j] = GAME_SETTINGS.emptyCellsValue;
                    }
                }
            }

            currentTetromino = rotateTetromino(currentTetromino);

            let i = tetrominoCurrentXPosition;

            currentTetromino.forEach((element) => {
                if (element.includes(GAME_SETTINGS.tetroCellsValue)) {
                    matrix[i].splice(k, element.length, element);
                    matrix[i] = matrix[i].flat();
                    i++;
                }
            });
        }
    } else if (e.key === "ArrowRight") {
        moveTetrominoRight(matrix, tetrominoCurrentCoordinates);
    }

    updateBoard(matrix);
};

const playGame = (matrix, board) => {
    makeNewTetrominoMovement(matrix, board);
};

const makeGame = () => {
    const MATRIX = createMatrix();
    const BOARD = createBoard();
    renderBoard(MATRIX, BOARD);

    playBtn.addEventListener("click", () => playGame(MATRIX, BOARD));
};

makeGame();
