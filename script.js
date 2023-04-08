const container = document.querySelector(".container");

const makeGame = () => {
    const createMatrix = () => {
        const initialMatrix = new Array(20).fill();
        const matrix = initialMatrix.map(element => {
            const row = new Array(10).fill(0);
            return row;
        })

        return matrix;
    };

    const MATRIX = createMatrix();

    const createBoard = () => {
        const board = document.createElement("div");
        board.setAttribute("class", "board");
        container.appendChild(board);
        return board;
    }

    const BOARD = createBoard();

    const createCell = () => {
        const cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        return cell;
    }

    const renderBoard = () => {
        MATRIX.forEach(row => {
            row.forEach((rowItem) => {
                const CELL = createCell();
                BOARD.appendChild(CELL)
            })
        })
    }

    renderBoard()

    console.log(BOARD)
};

makeGame();
