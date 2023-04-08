const container = document.querySelector(".container");
const canvas = document.getElementById("myCanvas");

const makeGame = () => {
    const context = canvas.getContext("2d");
    context.fillStyle = "red";
};

makeGame();
