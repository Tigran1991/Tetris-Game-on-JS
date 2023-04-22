const checkedTetromino = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ];

const rotateTetrominoToRight = () => {
        const tetromino = [];
        for (let i = 0; i < checkedTetromino.length; i++) {
            tetromino.push([]);
        }
        let k = 0;
        for (let i = checkedTetromino.length - 1; i >= 0; i--) {
            for (let j = 0; j < checkedTetromino[i].length; j++) {
                tetromino[j][k] = checkedTetromino[i][j];
            }
            k++;
        }
        return tetromino;
}

rotateTetrominoToRight();

pauseBtn.addEventListener("click", () => {
    clearInterval(interval);
});

resumeBtn.addEventListener("click", () => {
    interval = setInterval(
        moveTetrominoBottom,
        GAME_SETTINGS.tetroMoveingInterval
    );
});

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

if (matrix.every((row) => row.includes(2))) {
    createGameStatusBoard("GAME OVER !");
    return false;
} else if (quantity === 10) {
    createGameStatusBoard("YOU WIN !");
    return false;
}

quantity++;

let k = 4;

checkRowItems(matrix);

const checkRowItems = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].includes(2) && matrix[i].every((item) => item === 2)) {
            matrix.splice(i, 1);
            matrix.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            updateBoard();
        }
    }
};