
//board
let board;
let boardWidth = 1440;
let boardHeight = 630;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
let interval = 1500;



// Game settings for difficulty levels
let difficultySettings = {
    easy: { velocityX: -2, velocityY: -5, gravity: 0.4, interval: 1500 },
    medium: { velocityX: -3, velocityY: -5, gravity: 0.5, interval: 1000 },
    hard: { velocityX: -5, velocityY: -5, gravity: 0.6, interval: 600 }
};

// Initialize with 'easy' difficulty settings
let currentDifficulty = 'easy';
velocityX = difficultySettings[currentDifficulty].velocityX;
gravity = difficultySettings[currentDifficulty].gravity;
interval = difficultySettings[currentDifficulty].interval;

// Function to update game settings based on selected difficulty
function changeDifficulty() {
    let difficulty = document.getElementById("difficulty").value;
    currentDifficulty = difficulty;
    
    velocityX = difficultySettings[difficulty].velocityX;
    gravity = difficultySettings[difficulty].gravity;
    interval = difficultySettings[difficulty].interval;
    
    // Reset pipes and game state when difficulty is changed
    pipeArray = [];
    score = 0;
    gameOver = false;

    // Restart the pipe placement interval with the new setting
    clearInterval(pipeInterval);
    pipeInterval = setInterval(placePipes, interval);
}

// Call this function in window.onload to set the initial interval
let pipeInterval;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images, event listeners, and start the game loop
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    pipeInterval = setInterval(placePipes, interval);
    document.addEventListener("keydown", moveBird);
}




// window.onload = function() {
//     board = document.getElementById("board");
//     board.height = boardHeight;
//     board.width = boardWidth;
//     context = board.getContext("2d"); //used for drawing on the board

//     //draw flappy bird
//     // context.fillStyle = "green";
//     // context.fillRect(bird.x, bird.y, bird.width, bird.height);

//     //load images
//     birdImg = new Image();
//     birdImg.src = "./flappybird.png";
//     birdImg.onload = function() {
//         context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
//     }

//     topPipeImg = new Image();
//     topPipeImg.src = "./toppipe.png";

//     bottomPipeImg = new Image();
//     bottomPipeImg.src = "./bottompipe.png";

//     requestAnimationFrame(update);
//     setInterval(placePipes, interval);
//     document.addEventListener("keydown", moveBird);
// }

// function update() {
//     requestAnimationFrame(update);
//     if (gameOver) {
//         return;
//     }
//     context.clearRect(0, 0, board.width, board.height);

//     //bird
//     velocityY += gravity;
//     bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
//     context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

//     if (bird.y > board.height) {
//         gameOver = true;
//     }

//     //pipes
//     for (let i = 0; i < pipeArray.length; i++) {
//         let pipe = pipeArray[i];
//         pipe.x += velocityX;
//         context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

//         if (!pipe.passed && bird.x > pipe.x + pipe.width) {
//             score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
//             pipe.passed = true;
//         }

//         if (detectCollision(bird, pipe)) {
//             gameOver = true;
//         }
//     }

//     //clear pipes
//     while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
//         pipeArray.shift(); //removes first element from the array
//     }

//     // Update score in the HTML
//     document.getElementById("score").innerText = Math.floor(score);

//     if (gameOver) {
//         document.getElementById("score").innerText = "Game Over";
//     }
// }


function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        // context.clearRect(0, 0, board.width, board.height); // Clear the board
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText("GAME OVER", board.width / 2 - 100, board.height / 2); // Center the game over text
        // context.fillText("Score: " + score, board.width / 2 - 100, board.height / 2 + 50); // Show score below "GAME OVER"
        return; // Exit the update function
    }
    
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    document.getElementById("score").innerText = Math.floor(score);

    //score
    // context.fillStyle = "white";
    // context.font="45px sans-serif";
    // context.fillText("Score: " + Math.floor(score), 5, 45); // Update score display

    if (gameOver) {
        context.fillText("GAME OVER", board.width / 2 - 100, board.height / 2); // Center the game over text
        // context.fillText("Score: " + score, board.width / 2 - 100, board.height / 2 + 50); // Show score below "GAME OVER"
    }
}


function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    //jump
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
        velocityY = -5;
    }

    //reset game
    if (gameOver) {
        bird.X = birdY;
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
    
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}