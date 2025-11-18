let board;
let boardWidth = 450;
let boardHeight = 480;
let context;

let birdWidth = 35;
let birdHeight = 35;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 450;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;

let gravity = 0.3;
let gameOver = false;
let score = 0;
let playAgain = document.querySelector(".btn-p");

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    playAgain.addEventListener("click", () => {
        if (gameOver) {
            restart();
        }
    });

    birdImg = new Image();
    birdImg.src = "./bird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImg = new Image();
    topPipeImg.src = "./topPipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    board.addEventListener("click", jump);
    board.addEventListener("touchstart", (e) => {
        e.preventDefault();
        jump();
    }, { passive: false });
};

function jump() {
    if (!gameOver) {
        velocityY = -6;
    }
}

function update() {
    if (gameOver) {
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    velocityY += gravity;
    bird.y += velocityY;
    bird.y = Math.max(bird.y, 0);
    bird.y = Math.min(bird.y, boardHeight - birdHeight);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }
        if (detectCollosion(bird, pipe)) {
            gameOver = true;
            showGameOver();
        }
        if (bird.y + bird.height >= boardHeight) {
            gameOver = true;
            showGameOver();
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "#ffffff";
    context.font = "bold 20px 'Courier New', monospace";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.shadowColor = "#000000";
    context.shadowBlur = 4;
    context.fillText(`SCORE: ${Math.floor(score)}`, 20, 40);
}

function placePipes() {
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + openingSpace + pipeHeight,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if ((e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") && !gameOver) {
        velocityY = -6;
    }

    if ((e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") && gameOver) {
        restart();
    }
}

function detectCollosion(a, b) {
    let padding = 5;
    return a.x < b.x + b.width - padding &&
        a.x + a.width > b.x + padding &&
        a.y < b.y + b.height - padding &&
        a.y + a.height > b.y + padding;
}

function showGameOver() {
    context.fillStyle = "#ff3333";
    context.font = "bold 20px 'Courier New', monospace";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.shadowColor = "rgba(0,0,0,0.5)";
    context.fillText("GAME OVER", 20, 70);
}

const btn = document.querySelector(".btn-p");
btn.addEventListener("mouseover", (event) => {
    const x = event.pageX - btn.offsetLeft;
    const y = event.pageY - btn.offsetTop;
    btn.style.setProperty("--Xpos", x + "px");
    btn.style.setProperty("--Ypos", y + "px");
});

function restart() {
    bird.x = birdX;
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    velocityX = -2;
    velocityY = 0;
    gameOver = false;
    requestAnimationFrame(update);
}
