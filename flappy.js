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

let topPipeImg;
let bottomPipeImg;

let velocityX = -4;   // faster pipes
let velocityY = 0;

let gravity = 0.35;    // slightly stronger gravity
let jumpStrength = -7; // higher jump
let gameOver = false;
let score = 0;
let playAgain = document.querySelector(".btn-p");

let pipeTimer = 0;
let pipeInterval = 1500; // milliseconds
let lastTime = 0;

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
        if (gameOver) restart();
    });

    birdImg = new Image();
    birdImg.src = "./bird.png";

    topPipeImg = new Image();
    topPipeImg.src = "./topPipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    document.addEventListener("keydown", moveBird);
    board.addEventListener("click", jump);
    board.addEventListener("touchstart", (e) => {
        e.preventDefault();
        jump();
    }, { passive: false });

    requestAnimationFrame(update);
};

function jump() {
    if (!gameOver) velocityY = jumpStrength;
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        if (!gameOver) velocityY = jumpStrength;
        else restart();
    }
}

function update(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Pipe generation timer
    if (!gameOver) {
        pipeTimer += deltaTime;
        if (pipeTimer > pipeInterval) {
            placePipes();
            pipeTimer = 0;
        }
    }

    // Physics (only if game not over)
    if (!gameOver) {
        velocityY += gravity;
        bird.y += velocityY;

        // Ground collision
        if (bird.y + bird.height >= boardHeight) {
            bird.y = boardHeight - bird.height;
            gameOver = true;
        }

        // Ceiling collision
        bird.y = Math.max(0, bird.y);
    }

    // Clear board
    context.clearRect(0, 0, board.width, board.height);

    // Draw bird
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Draw pipes and check collisions
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        if (!gameOver) pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Score when passing top pipe
        if (!pipe.passed && pipe.img === topPipeImg && bird.x > pipe.x + pipe.width) {
            score++;
            pipe.passed = true;
        }

        // Collision with pipe
        if (!gameOver && detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Remove offscreen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Draw score
    context.fillStyle = "#ffffff";
    context.font = "bold 20px 'Courier New', monospace";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.shadowColor = "#000000";
    context.shadowBlur = 4;
    context.fillText(`SCORE: ${score}`, 20, 40);

    // Draw game over screen if game over
    if (gameOver) {
        showGameOver();
    } else {
        requestAnimationFrame(update);
    }
}


function placePipes() {
    let openingSpace = board.height / 4;
    let randomPipeY = -pipeHeight / 4 - Math.random() * (pipeHeight / 2);

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + openingSpace + pipeHeight,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(topPipe, bottomPipe);
}

function detectCollision(a, b) {
    let padding = 5;
    return a.x < b.x + b.width - padding &&
           a.x + a.width > b.x + padding &&
           a.y < b.y + b.height - padding &&
           a.y + a.height > b.y + padding;
}

function showGameOver() {
    context.fillStyle = "#ff3333";
    context.font = "bold 20px 'Courier New', monospace";
    context.textAlign = "center";
    context.fillText("GAME OVER", boardWidth *3/ 4, boardHeight / 10);
    context.font = "bold 20px 'Courier New', monospace";
    context.fillText(`FINAL SCORE: ${score}`, boardWidth *3/ 4, boardHeight / 6);
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
    velocityX = -4;
    velocityY = 0;
    gameOver = false;
    lastTime = 0;
    pipeTimer = 0;
    requestAnimationFrame(update);
}
