const container = document.querySelector(".container");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const resumeBtn = document.querySelector(".resume-btn");

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
    const index = getRandomId(0, 6);
    const checkedId = TETROMINO_IDS[index];
    return TETROMINOS[checkedId];
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

    const determineElementsCoordinates = () => {
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

    const getNewTetromino = () => {
        const checkedTetromino = getRandomTetrominoById();
        let i = 0;
        checkedTetromino.forEach((element) => {
            if (element.includes(1)) {
                MATRIX[i].splice(4, element.length, element);
                console.log(MATRIX);
                MATRIX[i] = MATRIX[i].flat();
                i++;
            }
        });

        return checkedTetromino;
    };

    const playGame = () => {
        const makeNewTetrominoMovement = () => {
            const todo = getNewTetromino();

            updateBoard(MATRIX);
            const moveTetrominoBottom = () => {
                const tetrominosElementsCoordinates =
                    determineElementsCoordinates();

                const checkMovementAbilityOptions =
                    tetrominosElementsCoordinates.map((coordinates) => {
                        if (
                            coordinates.x + 1 === MATRIX.length ||
                            MATRIX[coordinates.x + 1][coordinates.y] === 2
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                const updateMatrixAfterMoveing = () => {
                    if (!checkMovementAbilityOptions.includes(true)) {
                        tetrominosElementsCoordinates.forEach((movement) => {
                            MATRIX[movement.x][movement.y] = 0;
                            MATRIX[movement.x + 1][movement.y] = 1;
                        });
                    } else {
                        for (let i = 0; i < MATRIX.length; i++)
                            for (let j = 0; j < MATRIX[i].length; j++)
                                if (MATRIX[i][j] === 1) MATRIX[i][j] = 2;

                        clearInterval(interval);
                        makeNewTetrominoMovement();
                    }
                };

                updateMatrixAfterMoveing();
                updateBoard(MATRIX);
            };

            let interval = setInterval(moveTetrominoBottom, 300);

            pauseBtn.addEventListener("click", () => {
                clearInterval(interval);
            });

            resumeBtn.addEventListener("click", () => {
                interval = setInterval(moveTetrominoBottom, 300);
            });

            return todo;
        };

        const todo = makeNewTetrominoMovement();

        document.addEventListener("keydown", (e) => {
            const tetrominosElementsCoordinates =
                determineElementsCoordinates();
            if (e.key === "ArrowLeft") {
                const tetrominosMovement = tetrominosElementsCoordinates.map(
                    (coordinates) => {
                        if (
                            coordinates.y - 1 === -1 ||
                            MATRIX[coordinates.x][coordinates.y - 1] === 2
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                );

                if (!tetrominosMovement.includes(true)) {
                    tetrominosElementsCoordinates.forEach((movement) => {
                        MATRIX[movement.x][movement.y] = 0;
                        MATRIX[movement.x][movement.y - 1] = 1;
                    });
                }
            } else if (e.key === "ArrowUp") {
                const tetrominosMovement = tetrominosElementsCoordinates.map(
                    (coordinates) => {
                        if (
                            coordinates.x + 1 === 20 ||
                            MATRIX[coordinates.x + 1][coordinates.y] === 2 ||
                            coordinates.y - 1 === -1 ||
                            MATRIX[coordinates.x][coordinates.y - 1] === 2 ||
                            coordinates.y + 1 === 10 ||
                            MATRIX[coordinates.x][coordinates.y + 1] === 2
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                );

                if (!tetrominosMovement.includes(true)) {
                    let f;
                    let n;
                    for (let i = 0; i < MATRIX.length; i++) {
                        for (let j = 0; j < MATRIX[i].length; j++) {
                            if (MATRIX[i][j] === 1){
                                f = i;
                                n = j;
                                MATRIX[i][j] = 0;
                            };
                        }
                    }

                    const rotateTetrominoToRight = () => {
                        const a = [];
                        for (let i = 0; i < todo.length; i++) {
                            a.push([]);
                        }
                        let k = 0;
                        for (let i = todo.length - 1; i >= 0; i--) {
                            for (let j = 0; j < todo[i].length; j++) {
                                a[j][k] = todo[i][j];
                            }
                            k++;
                        }
                        return a;
                    };

                    const todo1 = rotateTetrominoToRight();
                    let i = f;
                    todo1.forEach((element) => {
                        if (element.includes(1)) {
                            MATRIX[i].splice(n - 1, element.length, element);
                            MATRIX[i] = MATRIX[i].flat();
                            i++;
                        }
                    });
                }
            } else if (e.key === "ArrowRight") {
                const tetrominosMovement = tetrominosElementsCoordinates.map(
                    (coordinates) => {
                        if (
                            coordinates.y + 1 === 10 ||
                            MATRIX[coordinates.x][coordinates.y + 1] === 2
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                );

                if (!tetrominosMovement.includes(true)) {
                    tetrominosElementsCoordinates
                        .reverse()
                        .forEach((movement) => {
                            MATRIX[movement.x][movement.y] = 0;
                            MATRIX[movement.x][movement.y + 1] = 1;
                        });
                }
            }

            updateBoard(MATRIX);
        });
    };

    playBtn.addEventListener("click", playGame);
};

makeGame();
