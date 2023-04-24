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
    tetroMoveingInterval: 400,
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

const makeGame = () => {
    const MATRIX = createMatrix();

    const addNewtetrominoToMatrix = (initialTetromino) => {
        const tetromino = initialTetromino.filter((row) => row.includes(1));
        tetromino.forEach((element, i) => {
            MATRIX[i].splice(4, element.length, element);
            MATRIX[i] = MATRIX[i].flat();
        });
    };

    const BOARD = createBoard();

    const renderBoard = (board) => {
        MATRIX.forEach((row) => {
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

    renderBoard(BOARD);

    const updateBoard = () => {
        if (document.querySelector(".board") !== null) {
            document.querySelector(".board").remove();
        }
        const BOARD = createBoard();
        renderBoard(BOARD);
    };

    const getTetrominoCurrentCoordinates = () => {
        const currentCoordinates = [];
        for (let i = MATRIX.length - 1; i >= 0; i--) {
            if (MATRIX[i].includes(1)) {
                for (let j = 0; j < MATRIX[i].length; j++) {
                    if (MATRIX[i][j] === 1) {
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

    const getTetrominoNewCoordinatesAfterMoveingRight = (
        currentCoordinates
    ) => {
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
                coordinate.x !== MATRIX.length &&
                MATRIX[coordinate.x][coordinate.y] !==
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
                MATRIX[coordinate.x][coordinate.y - 1] !==
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
                MATRIX[coordinate.x][coordinate.y + 1] !==
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

    const moveTetrominoLeft = (tetrominoCurrentCoordinates) => {
        const tetrominoNewCoordinates =
            getTetrominoNewCoordinatesAfterMoveingLeft(
                tetrominoCurrentCoordinates
            );
        const canMoveLeft = isTetrominoCanMoveLeft(tetrominoNewCoordinates);
        if (canMoveLeft) {
            tetrominoCurrentCoordinates.forEach((coordinate) => {
                MATRIX[coordinate.x][coordinate.y] =
                    GAME_SETTINGS.emptyCellsValue;
            });
            tetrominoNewCoordinates.forEach((coordinate) => {
                MATRIX[coordinate.x][coordinate.y] =
                    GAME_SETTINGS.tetroCellsValue;
            });
        }
    };

    const moveTetrominoRight = (tetrominoCurrentCoordinates) => {
        const tetrominoNewCoordinates =
            getTetrominoNewCoordinatesAfterMoveingRight(
                tetrominoCurrentCoordinates
            );
        const canMoveRight = isTetrominoCanMoveRight(tetrominoNewCoordinates);
        if (canMoveRight) {
            tetrominoCurrentCoordinates.forEach((coordinate) => {
                MATRIX[coordinate.x][coordinate.y] =
                    GAME_SETTINGS.emptyCellsValue;
            });
            tetrominoNewCoordinates.forEach((coordinate) => {
                MATRIX[coordinate.x][coordinate.y] =
                    GAME_SETTINGS.tetroCellsValue;
            });
        }
    };

    const getTetrominoPositionFromTop = (currentCoordinates) => {
        let positionsFromTop = [];
        for (let i = 0; i < currentCoordinates.length; i++) {
            positionsFromTop.push(currentCoordinates[i].x);
        }

        const positionFromTop = Math.min(...positionsFromTop);
        return positionFromTop;
    };

    const getTetrominoPositionFromLeft = (currentCoordinates) => {
        let positionsFromLeft = [];
        for (let i = 0; i < currentCoordinates.length; i++) {
            positionsFromLeft.push(currentCoordinates[i].y);
        }
        const positionFromLeft = Math.min(...positionsFromLeft);
        return positionFromLeft;
    };

    const moveTetrominoBottom = (board, interval) => {
        const tetrominoCurrentCoordinates = getTetrominoCurrentCoordinates();
        const positionsFromTop = getTetrominoPositionFromTop(
            tetrominoCurrentCoordinates
        );
        const positionsFromLeft = getTetrominoPositionFromLeft(
            tetrominoCurrentCoordinates
        );
        console.log(`x: ${positionsFromTop}`, `y: ${positionsFromLeft}`);
        const tetrominoNewCoordinates = getTetrominoNewCoordinates(
            tetrominoCurrentCoordinates
        );
        const canMove = isTetrominoCanMove(tetrominoNewCoordinates);
        if (canMove) {
            tetrominoCurrentCoordinates.forEach((coordinates) => {
                MATRIX[coordinates.x][coordinates.y] =
                    GAME_SETTINGS.emptyCellsValue;
            });
            tetrominoNewCoordinates.forEach((coordinates) => {
                MATRIX[coordinates.x][coordinates.y] =
                    GAME_SETTINGS.tetroCellsValue;
            });
        } else {
            for (let i = 0; i < MATRIX.length; i++) {
                for (let j = 0; j < MATRIX[i].length; j++) {
                    if (MATRIX[i][j] === GAME_SETTINGS.tetroCellsValue) {
                        MATRIX[i][j] = GAME_SETTINGS.doneTetroCellsValue;
                    }
                }
            }
            clearInterval(interval);
            document.removeEventListener("keydown", handleKeyboardEvents);
            makeNewTetrominoMovement(board);
        }
    };

    const makeNewTetrominoMovement = (board) => {
        const randomIndex = generateRandomNumber(
            GAME_SETTINGS.rangeOfIndex[0],
            GAME_SETTINGS.rangeOfIndex[1]
        );
        const currentTetromino = getRandomTetromino(randomIndex);
        console.log(currentTetromino);
        addNewtetrominoToMatrix(currentTetromino);
        updateBoard();

        let interval = setInterval(() => {
            moveTetrominoBottom(board, interval);
            updateBoard();
        }, GAME_SETTINGS.tetroMoveingInterval);
        document.addEventListener("keydown", handleKeyboardEvents);
    };

    const rotateTetromino = () => {};

    const handleKeyboardEvents = (e) => {
        const tetrominoCurrentCoordinates = getTetrominoCurrentCoordinates();
        if (e.key === "ArrowLeft") {
            moveTetrominoLeft(tetrominoCurrentCoordinates);
        } else if (e.key === "ArrowUp") {
            rotateTetromino();
        } else if (e.key === "ArrowRight") {
            moveTetrominoRight(tetrominoCurrentCoordinates);
        }

        updateBoard();
    };

    const playGame = () => {
        makeNewTetrominoMovement(BOARD);
    };

    playBtn.addEventListener("click", () => playGame());
};

makeGame();
