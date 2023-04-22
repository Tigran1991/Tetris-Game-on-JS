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

const tetrominoMovementAbilityOptions = tetrominosElementsCoordinates.map(
    (coordinates) => {
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
    }
);

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