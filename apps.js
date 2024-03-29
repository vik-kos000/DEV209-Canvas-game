
// create a canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 523;
document.body.appendChild(canvas);

// Chessboard representation
let chessBoard = [
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x','x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x','x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x','x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x','x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x','x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x','x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x','x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x','x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x','x'],
];

// Background image
let bgReady = false;
let bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/grass.png";

// up border
let upReady = false;
let upImage = new Image();
upImage.onload = function () {
    upReady = true;
};
upImage.src = "images/rockBorderUp.png";

// right border
let rightReady = false;
let rightImage = new Image();
rightImage.onload = function () {
    rightReady = true;
};
rightImage.src = "images/rockBorderRight.png";

// bottom border
let bottomReady = false;
let bottomImage = new Image();
bottomImage.onload = function () {
    bottomReady = true;
};
bottomImage.src = "images/rockBorderBottom.png";

// left border
let leftReady = false;
let leftImage = new Image();
leftImage.onload = function () {
    leftReady = true;
};
leftImage.src = "images/rockBorderLeft.png";


// main guy image
let guyReady = false;
let guyImage = new Image();
guyImage.onload = function(){
    guyReady = true;
};
//changing guy images to sprite sheet
guyImage.src = "images/mainGuy.png"; //using the mainGuy

//adding sprite sheet variables
var rows = 4; //sprite sheet has 4 rows
var cols = 6; //spite sheet has 6 columns

//second row for left movement counting from index 0
var trackLeft = 1; 
//third row for right movement counting from index 0
var trackRight = 2; 
var trackUp = 3; //not using up and down 
var trackDown = 0; // might have to change

var spriteWidth = 289;
var spriteHeight = 191; 
var width = spriteWidth / cols;
var height = spriteHeight / rows;

var curXFrame = 0; // start on left side
var frameCount = 4; // 3 frames per rows

//x and y coord of the overall sprite image to get the single frame we want
var srcX = 0; // assuming image has no borders and other stuff
var srcY = 0;

//assuming the at start the character will move right side
var left = false; 
var right = true;

//adding up and right for the guy
var up = false;
var down = true; 

// sheep image 1
let sheepReady = false;
let sheepImage = new Image();
sheepImage.onload = function () {
    sheepReady = true;
};
sheepImage.src = "images/sheep.png";

// sheep image 2
let sheep2Ready = false;
let sheep2Image = new Image();
sheep2Image.onload = function () {
    sheep2Ready = true;
};
sheep2Image.src = "images/sheep.png";

// sheep image 3
let sheep3Ready = false;
let sheep3Image = new Image();
sheep3Image.onload = function () {
    sheep3Ready = true;
};
sheep3Image.src = "images/sheep.png";

// wolf image 1
let wolfReady = false;
let wolfImage = new Image();
wolfImage.onload = function () {
    wolfReady = true;
};
wolfImage.src = "images/wolf.png";

// wolf image 2
let wolf2Ready = false;
let wolf2Image = new Image();
wolf2Image.onload = function () {
    wolf2Ready = true;
};
wolf2Image.src = "images/wolf.png";

// wolf image 3
let wolf3Ready = false;
let wolf3Image = new Image();
wolf3Image.onload = function () {
    wolf3Ready = true;
};
wolf3Image.src = "images/wolf.png";

// Game objects
let guy = {
    speed: 100, // movement in pixels per second
    x: 0, // where on the canvas are they?
    y: 0 // where on the canvas are they?
};
let sheep = {
    // for this version, the sheep does not move, so just and x and y
    x: 0,
    y: 0
};

let sheep2 = {
    // for this version, the sheep does not move, so just and x and y
    x: 0,
    y: 0
};

let sheep3 = {
    // for this version, the sheep does not move, so just and x and y
    x: 0,
    y: 0
};

let sheepsCaught = 0;

let wolf = {
    x: 0,
    y: 0,
    direction : 1
}

let wolf2 = {
    x: 0,
    y: 0,
    direction : -1
}

let wolf3 = {
    x: 0,
    y: 0,
    direction: 1
}

//adding wolf speed
let wolfspeed= 80; //adjust this for wolf speed

// 
//audio Section

//define sheep sound
let sheepSound= document.getElementById('sheepSound');
let guyScream = document.getElementById('guyScream');




// Handle keyboard controls
let keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down. In our game loop, we will move the guy image if when
// we go through render, a key is down
addEventListener("keydown", function (e) {
    //console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
    //console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);

let sheepPresent = true;
let sheep2Present = true;
let sheep3Present = true;
let gameOver = false;
let died = false;
var counter = 0;
let isMoving = false;

// Update game objects
let update = function (modifier) {
    // Update code for sprite

    // Clear last guy image position and assume he is not moving left or right 
    ctx.clearRect(guy.x, guy.y, width, height);
    left = false; 
    right = false; 
    up = false;
    down = false;

    // Check for arrow key presses
    if ((37 in keysDown && 38 in keysDown) && (guy.x > 15 && guy.y > 24)) { // Left key and Up key
        guy.x -= guy.speed * modifier * 0.75;
        guy.y -= guy.speed * modifier * 0.75;
        left = true;
        up = true;
        isMoving = true;
    }
    else if ((37 in keysDown && 40 in keysDown) && (guy.x > 15 && guy.y < canvas.height - 24 - height)) { // Left key and Down key
        guy.x -= guy.speed * modifier * 0.75;
        guy.y += guy.speed * modifier * 0.75;
        left = true;
        down = true;
        isMoving = true;
    }
    else if ((39 in keysDown && 38 in keysDown) && (guy.x < canvas.width - 15 - width && guy.y > 24)) { // Right key and Up key
        guy.x += guy.speed * modifier * 0.75;
        guy.y -= guy.speed * modifier * 0.75;
        right = true;
        up = true;
        isMoving = true;
    }
    else if ((39 in keysDown && 40 in keysDown) && (guy.x < canvas.width - 15 - width && guy.y < canvas.height - 24 - height)) { // Right key and Down key
        guy.x += guy.speed * modifier * 0.75;
        guy.y += guy.speed * modifier * 0.75;
        right = true;
        down = true;
        isMoving = true;
    }
    else if (37 in keysDown && guy.x > 15) { // Left key
        guy.x -= guy.speed * modifier;
        left = true;
        isMoving = true;
    }
    else if (39 in keysDown && guy.x < canvas.width - 15 - width) { // Right key
        guy.x += guy.speed * modifier;
        right = true;
        isMoving = true;
    }
    else if (38 in keysDown && guy.y > 24) { // Up key
        guy.y -= guy.speed * modifier;
        up = true;
        isMoving = true;
    }
    else if (40 in keysDown && guy.y < canvas.height - 24 - height) { // Down key
        guy.y += guy.speed * modifier;
        down = true;
        isMoving = true;
    }
    else {
        isMoving = false; // character is not moving
    }





    // Are they touching? sheep 1
    if (
        guy.x <= (sheep.x + 23)
        && sheep.x <= (guy.x + 40)
        && guy.y <= (sheep.y + 33)
        && sheep.y <= (guy.y + 42)
        && sheepPresent
    ) {
        //sheepsCaught += 1; // keep track of our “score”
        sheepPresent = false;
        sheepSound.play();
    }

    // Are they touching? sheep 2
    if (
        guy.x <= (sheep2.x + 23)
        && sheep2.x <= (guy.x + 40)
        && guy.y <= (sheep2.y + 33)
        && sheep2.y <= (guy.y + 42)
        && sheep2Present
    ) {
        //sheepsCaught += 1; // keep track of our “score”
        sheep2Present = false;
        sheepSound.play();
    }

    // Are they touching? sheep 3
    if (
        guy.x <= (sheep3.x + 23)
        && sheep3.x <= (guy.x + 40)
        && guy.y <= (sheep3.y + 33)
        && sheep3.y <= (guy.y + 42)
        && sheep3Present
    ) {
        //sheepsCaught += 1; // keep track of our “score”
        sheep3Present = false;
        sheepSound.play();
    }

    // Check for collision with wolf1
    if (
        guy.x <= (wolf.x + 25)
        && wolf.x <= (guy.x + 25)
        && guy.y <= (wolf.y + 45)
        && wolf.y <= (guy.y + 45)
    ) {
        gameOver = true; 
    }

    // Check for collision with wolf2
    if (
        guy.x <= (wolf2.x + 25)
        && wolf2.x <= (guy.x + 25)
        && guy.y <= (wolf2.y + 45)
        && wolf2.y <= (guy.y + 45)
    ) {
        gameOver = true; 
    }

    // Check for collision with wolf3
    if (
        guy.x <= (wolf3.x + 25)
        && wolf3.x <= (guy.x + 25)
        && guy.y <= (wolf3.y + 45)
        && wolf3.y <= (guy.y + 45)
    ) {
        gameOver = true; 
    }

    //adding wolf movements 
    // Update wolf movement
    updateWolf = function(wolf) {
        wolf.x += wolfspeed * modifier * wolf.direction; 
        // Check if wolf reaches the left or right boundary
        if (wolf.x <= 0 || wolf.x >= canvas.width - 70) {
            wolf.direction *= -1; // Reverse direction
        }
    }

    // Call updateWolf for each wolf object
    updateWolf(wolf);
    updateWolf(wolf2);
    updateWolf(wolf3);



    // Check if game is over
    if (gameOver) {
        // Perform end-game actions
        guyScream.play();
        alert("Game Over! You were caught by the wolf. Press F5 to play again.");
        return; // Stop updating game objects
    }
    

    //add code to pick one of the frame of the sprite sheet
    //curXFrame = ++curXFrame % frameCount; //update sprite sheet frame index

    if (counter == 8){
        //change the walking speed
        curXFrame = ++curXFrame % frameCount; 
        counter = 0;
    }
    else{
        counter++;
    }

    srcX = curXFrame * width;
    if (left) {
        srcY = trackLeft * height;
    } else if (right) {
        srcY = trackRight * height;
    } else if (up) {
        srcY = trackUp * height;
    } else if (down) {
        srcY = trackDown * height;
    }
};


let render = function () {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (upReady) {
        ctx.drawImage(upImage, 0, 0);
    }

    if (bottomReady) {
        ctx.drawImage(bottomImage, 0, 496);
    }

    if (rightReady) {
        ctx.drawImage(rightImage, 573, 0);
    }

    if (leftReady) {
        ctx.drawImage(leftImage, 0, 0);
    }
    
    // Draw 1 sheep
    if (sheepReady && sheepPresent) {
        ctx.drawImage(sheepImage, sheep.x, sheep.y);
    }

    // Draw 2 sheep
    if (sheep2Ready && sheep2Present) {
        ctx.drawImage(sheep2Image, sheep2.x, sheep2.y);
    }

    // Draw 3 sheep
    if (sheep3Ready && sheep3Present) {
        ctx.drawImage(sheep3Image, sheep3.x, sheep3.y);
    }

    // Draw the wolf 1
    if (wolfReady) {
        ctx.drawImage(wolfImage, wolf.x, wolf.y);
    }

    // Draw the wolf 2
    if (wolf2Ready) {
        ctx.drawImage(wolf2Image, wolf2.x, wolf2.y);
    }

    // Draw the wolf 3
    if (wolf3Ready) {
        ctx.drawImage(wolf3Image, wolf3.x, wolf3.y);
    }

    // draw the guy
    if (guyReady) {
        if (isMoving) {
            // Draw the walking animation
            ctx.drawImage(guyImage, srcX, srcY, width, height, guy.x, guy.y, width, height);
        } else {
            // Draw the idle animation
            ctx.drawImage(guyImage, (frameCount - 1) * width, srcY, width, height, guy.x, guy.y, width, height);
        }
    }


    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Level: " + sheepsCaught, 32, 32);
}



// The main game loop
let main = function () {
    let bgMusic = document.getElementById('Music');
    bgMusic.play();
    //stopping the game after all sheep are collected
    if (!sheepPresent && !sheep2Present && !sheep3Present){
        sheepsCaught += 1;
        reset();
    }
    if (sheepsCaught == 5){
        alert("You won the game, Press F5 to play again.") 
        bgMusic.pause();
        return; // stopping the game
    }
    // Stop the background music when the game is over
    if (gameOver) {
        bgMusic.pause();
    }
    if (gameOver) return;

    let now = Date.now();
    let delta = now - then;
    update(delta / 1100);
    render();
    then = now;
    // Request to do this again ASAP
    requestAnimationFrame(main);
};

let placeItem = function (character) {
    let X, Y;
    let success = false;
    while (!success) {
        X = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
        Y = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6

        if (chessBoard[X][Y] === 'x' &&
            (Math.abs(X * 75 + 27 + 24 - guy.x) > 48 || Math.abs(Y * 65 + 27 + 24 - guy.y) > 48)) {
            success = true;
        }
    }
    chessBoard[X][Y] = 'O';
    character.x = (X * 75) + 27 + 24; // Adjusted spawn position with border width
    character.y = (Y * 65) + 27 + 24; // Adjusted spawn position with border height
}

let placeWolf = function (character) {
    let X, Y;
    let success = false;
    while (!success) {
        X = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
        Y = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6

        // Check if the coordinates coincide with the rows where the main guy is not present
        if (chessBoard[X][Y] === 'x' &&
            (Math.abs(X * 75 + 27 + 24 - guy.x) > 48 || Math.abs(Y * 65 + 27 + 24 - guy.y) > 48) &&
            X !== 3) { // Avoid row 3
            success = true;
        }
    }
    chessBoard[X][Y] = 'O';
    character.x = (Y * 75) + 27 + 24; // Adjusted spawn position with border width
    character.y = (X * 65) + 27 + 24; // Adjusted spawn position with border height
}

// Reset the game when the player catches a sheep
let reset = function () {
    if (died == true) {
        alert("you died")
    } else {
        // Clear chessboard
        for (let i = 0; i < chessBoard.length; i++) {
            for (let j = 0; j < chessBoard[i].length; j++) {
                chessBoard[i][j] = 'x';
            }
        }

        guy.x = (canvas.width / 2) - 16;
        guy.y = (canvas.height / 2) - 16;

        placeItem(sheep);
        placeItem(sheep2);
        placeItem(sheep3);
        placeWolf(wolf);
        placeWolf(wolf2);
        placeWolf(wolf3);
    }

     // Reset sheep present flags
     sheepPresent = true;
     sheep2Present = true;
     sheep3Present = true;
 
     // Reset game over flag
     gameOver = false;
};

// Let's play this game!
let then = Date.now();
reset();
main(); // call the main game loop.
