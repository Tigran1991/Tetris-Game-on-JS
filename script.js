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
    tetroMoveingInterval: 1000,
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

const getRandomTetromino = (index) => {
    const checkedId = TETROMINO_IDS[index];
    return TETROMINOS[checkedId];
};

const createMatrix = () => {
    const initialMatrix = new Array(GAME_SETTINGS.lengthOfMatrix).fill();
    const matrix = initialMatrix.map((row) => {
        row = new Array(GAME_SETTINGS.lengthOfRows).fill(
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

const playGame = (matrix, board) => {
    const addNewTetrominoToMatrix = (initialTetromino) => {
        const tetromino = initialTetromino.filter((row) => row.includes(1));
        tetromino.forEach((element, i) => {
            matrix[i].splice(4, element.length, element);
            matrix[i] = matrix[i].flat();
        });
        updateBoard(matrix);
    };

    const updateBoard = () => {
        if (document.querySelector(".board") !== null) {
            document.querySelector(".board").remove();
        }
        const BOARD = createBoard();
        renderBoard(matrix, BOARD);
    };

    const getCurrentCoordinates = () => {
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

    const getNewCoordinates = (currentCoordinates) => {
        const newCoordinates = currentCoordinates.map((coordinates) => {
            const updatedCoordinates = {};
            updatedCoordinates.x = coordinates.x + GAME_SETTINGS.step;
            updatedCoordinates.y = coordinates.y;
            return updatedCoordinates;
        });

        return newCoordinates;
    };

    const getNewCoordinatesAfterMoveingLeft = (currentCoordinates) => {
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

    const getNewCoordinatesAfterMoveingRight = (currentCoordinates) => {
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

    const isTetrominoCanMove = (newCoordinates) => {
        const tetrominoMovementAbility = newCoordinates.map((coordinate) => {
            if (
                coordinate.x !== matrix.length &&
                matrix[coordinate.x][coordinate.y] !==
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

    const isTetrominoCanMoveLeft = (newCoordinates) => {
        const tetrominoMovementAbility = newCoordinates.map((coordinate) => {
            if (
                coordinate.y !== undefined &&
                matrix[coordinate.x][coordinate.y - 1] !==
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

    const isTetrominoCanMoveRight = (newCoordinates) => {
        const tetrominoMovementAbility = newCoordinates.map((coordinate) => {
            if (
                coordinate.y !== undefined &&
                matrix[coordinate.x][coordinate.y + 1] !==
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

    const moveTetrominoLeft = (currentCoordinates) => {
        const newCoordinates =
            getNewCoordinatesAfterMoveingLeft(currentCoordinates);
        const canMoveLeft = isTetrominoCanMoveLeft(newCoordinates);
        if (canMoveLeft) {
            currentCoordinates.forEach((coordinate) => {
                matrix[coordinate.x][coordinate.y] =
                    GAME_SETTINGS.emptyCellsValue;
            });
            newCoordinates.forEach((coordinate) => {
                matrix[coordinate.x][coordinate.y] =
                    GAME_SETTINGS.tetroCellsValue;
            });
        }
    };

    const moveTetrominoRight = (currentCoordinates) => {
        const newCoordinates =
            getNewCoordinatesAfterMoveingRight(currentCoordinates);
        const canMoveRight = isTetrominoCanMoveRight(newCoordinates);
        if (canMoveRight) {
            currentCoordinates.forEach((coordinate) => {
                matrix[coordinate.x][coordinate.y] =
                    GAME_SETTINGS.emptyCellsValue;
            });
            newCoordinates.forEach((coordinate) => {
                matrix[coordinate.x][coordinate.y] =
                    GAME_SETTINGS.tetroCellsValue;
            });
        }
    };

    const updatePreviousCellValues = (currentCoordinates) => {
        currentCoordinates.forEach((coordinates) => {
            matrix[coordinates.x][coordinates.y] =
                GAME_SETTINGS.emptyCellsValue;
        });
    };

    const updateNewCellValues = (newCoordinates) => {
        newCoordinates.forEach((coordinates) => {
            matrix[coordinates.x][coordinates.y] =
                GAME_SETTINGS.tetroCellsValue;
        });
    };

    const updateDoneTetroCellValues = () => {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === GAME_SETTINGS.tetroCellsValue) {
                    matrix[i][j] = GAME_SETTINGS.doneTetroCellsValue;
                }
            }
        }
    };

    const handleKeyboardEvents = (e) => {
        const currentCoordinates = getCurrentCoordinates(matrix);
        if (e.key === "ArrowLeft") {
            moveTetrominoLeft(currentCoordinates);
        } else if (e.key === "ArrowUp") {
            console.log("Helooo");
        } else if (e.key === "ArrowRight") {
            moveTetrominoRight(currentCoordinates);
        }

        updateBoard(matrix);
    };

    const moveBottom = () => {
        let interval = setInterval(() => {
            const currentCoordinates = getCurrentCoordinates(matrix);
            const newCoordinates = getNewCoordinates(currentCoordinates);
            const canMove = isTetrominoCanMove(newCoordinates);
            if (canMove) {
                updatePreviousCellValues(currentCoordinates);
                updateNewCellValues(newCoordinates);
                updateBoard(matrix);
            } else {
                updateDoneTetroCellValues(matrix);
                clearInterval(interval);
                document.removeEventListener("keydown", handleKeyboardEvents);
                makeNewTetrominoMove(matrix, board);
            }
        }, 1000);
    };

    const makeNewTetrominoMove = () => {
        const randomIndex = utils.generateRandomNumber(0, 6);
        let currentTetromino = getRandomTetromino(randomIndex);
        addNewTetrominoToMatrix(currentTetromino);
        moveBottom();
        document.addEventListener("keydown", handleKeyboardEvents);
    };

    makeNewTetrominoMove(matrix, board);
};

const newGame = () => {
    const MATRIX = createMatrix();
    const BOARD = createBoard();
    renderBoard(MATRIX, BOARD);
    playBtn.addEventListener("click", () => playGame(MATRIX, BOARD));
};

newGame();
