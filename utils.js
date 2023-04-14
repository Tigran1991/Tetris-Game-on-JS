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