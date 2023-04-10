const utils = {
    getRandomId: (min, max) => Math.floor(Math.random() * (max - min) + min),

    getRandomTetrominoById: () => {
        const index = utils.getRandomId(0, 6);
        const checkedId = TETROMINO_IDS[index];
        return TETROMINOS[checkedId];
    },
}

// for (let i = MATRIX.length - 1; i >= 0; i--) {
//     for (let j = 0; j < MATRIX[i].length; j++) {
//         if (MATRIX[i][j] === 1) {
//             MATRIX[i][j] = 0;
//             MATRIX[i + 1][j] = 1;
//         }
//     }
// }