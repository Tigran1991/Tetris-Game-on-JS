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
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
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
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
};

const getRandomId = (min, max) => Math.floor(Math.random() * (max - min) + min);

const getRandomTetrominoById = () => {
    const index = getRandomId(0, 6)
    return TETROMINOS[TETROMINO_IDS[index]]
}

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
                if(rowItem === 0){
                    const CELL = createCell();
                    BOARD.appendChild(CELL);
                }else{
                    const TETRO_CELL = createTetroCell();
                    BOARD.appendChild(TETRO_CELL);
                }
            });
        });
    };

    renderBoard(MATRIX);

    const updateBoard = (matrix) => {
        if(document.querySelector('.board') !== null){
            document.querySelector('.board').remove()
        }
        renderBoard(matrix);
    }

    const addTetraminoInBoard = () => {
        const checkedTetromino = getRandomTetrominoById();
        for (let i = 0; i < checkedTetromino.length; i++) {
            MATRIX[i].splice(4, checkedTetromino[i].length, checkedTetromino[i]);
            MATRIX[i] = MATRIX[i].flat() 
        }
        updateBoard(MATRIX)
    }

    playBtn.addEventListener("click", addTetraminoInBoard)
};

makeGame();
