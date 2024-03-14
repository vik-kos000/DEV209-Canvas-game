// create a canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 523;
document.body.appendChild(canvas);

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
let heroReady = false;
let heroImage = new Image();
heroImage.onload = function(){
    heroReady = true;
};
//changing hero images to sprite sheet
heroImage.src = "images/mainGuy.png"; //using the mainGuy

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

//adding up and right for the hero
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

// wolf image
let wolfReady = false;
let wolfImage = new Image();
wolfImage.onload = function () {
    wolfReady = true;
};
wolfImage.src = "images/wolf.png";


// Game objects
let hero = {
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
    y: 0
}

// Handle keyboard controls
let keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down. In our game loop, we will move the hero image if when
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

// Update game objects
let update = function (modifier) {
    //update code for sprite

    //clear last hero image position and assume he is not moving left or right 
    ctx.clearRect(hero.x, hero.y, width, height);
    left = false; 
    right = false; 

    // decide if they are moving left or right and set those 
    if (37 in keysDown && hero.x > 24) { // Left key
        hero.x -= hero.speed * modifier;
        left = true; //for animation
        right = false; // for animation
    }
    
    if (39 in keysDown && hero.x < canvas.width - 24 - width) { // Right key
        hero.x += hero.speed * modifier;
        left = false; //for animation
        right = true; // for animation
    }
    
    if (38 in keysDown && hero.y > 24) { // Up key
        hero.y -= hero.speed * modifier;
        up = true;
        down = false; 
    }
    
    if (40 in keysDown && hero.y < canvas.height - 24 - height) { // Down key
        hero.y += hero.speed * modifier;
        down = true;
        up = false; 
    }

    // Are they touching? sheep 1
    if (
        hero.x <= (sheep.x + 23)
        && sheep.x <= (hero.x + 40)
        && hero.y <= (sheep.y + 33)
        && sheep.y <= (hero.y + 42)
    ) {
        //sheepsCaught += 1; // keep track of our “score”
        sheepPresent = false;
    }

    // Are they touching? sheep 2
    if (
        hero.x <= (sheep2.x + 23)
        && sheep2.x <= (hero.x + 40)
        && hero.y <= (sheep2.y + 33)
        && sheep2.y <= (hero.y + 42)
    ) {
        //sheepsCaught += 1; // keep track of our “score”
        sheep2Present = false;
    }

    // Are they touching? sheep 3
    if (
        hero.x <= (sheep3.x + 23)
        && sheep3.x <= (hero.x + 40)
        && hero.y <= (sheep3.y + 33)
        && sheep3.y <= (hero.y + 42)
    ) {
        //sheepsCaught += 1; // keep track of our “score”
        sheep3Present = false;
    }

    // Check for collision with hero
    if (
        hero.x <= (wolf.x + 25)
        && wolf.x <= (hero.x + 25)
        && hero.y <= (wolf.y + 45)
        && wolf.y <= (hero.y + 45)
    ) {
        gameOver = true; 
    }

    // Check if game is over
    if (gameOver) {
        // Perform end-game actions
        alert("Game Over! You were caught by the wolf. Press F5 to play again.");
        return; // Stop updating game objects
    }

    // Check for collision between sheep and wolf
    if (
        sheep.x <= (wolf.x + 23)
        && wolf.x <= (sheep.x + 40)
        && sheep.y <= (wolf.y + 33)
        && wolf.y <= (sheep.y + 32)
    ) {
        // Handle collision here, such as resetting the game
        reset(); // Restart the game
    }


    //add code to pick one of the frame of the sprite sheet
    //curXFrame = ++curXFrame % frameCount; //update sprite sheet frame index
    var counter = 0;
    if (counter == 5){
        //change the walking speed
        curXFrame = ++curXFrame % frameCount; 
        counter = 0;
    }
    else{
        counter++;
    }

    
    srcX = curXFrame * width;
    // if (left){
    //     //calculate Y src 
    //     srcY = trackLeft * height; 
    // }
    // if (right){
    //     srcY = trackRight * height; 
    // }
    // if (left == false && right == false){
    //     srcX = 1 * width;
    //     srcY = 2 * height;
    // }

    if (left || right) {
        curXFrame = ++curXFrame % frameCount;
    }
    if (up || down) {
        curXFrame = 1; // Fixed frame for up and down movement
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

    // Draw the wolf
    if (wolfReady) {
        ctx.drawImage(wolfImage, wolf.x, wolf.y);
    }

    // draw the hero
    if (heroReady) {
        //ctx.drawImage(heroImage, hero.x, hero.y);
        //ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y, width, height);
        //ctx.globalCompositeOperation = "source-over";
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Sheep saved: " + sheepsCaught, 32, 32);
}



// The main game loop
let main = function () {
    //stopping the game after 10 points
    if (!sheepPresent && !sheep2Present && !sheep3Present){
        alert("You won the game, Press F5 to play again")
        return; // stopping the game
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

// Reset the game when the player catches a sheep
let reset = function () {
    hero.x = (canvas.width / 2) - 16;
    hero.y = (canvas.height / 2) - 16;
    //Place the sheep somewhere on the screen randomly
    // but not in the hedges, Article in wrong, the 64 needs to be
    // hedge 32 + hedge 32 + char 32 = 96
    sheep.x = 32 + (Math.random() * (canvas.width - 94));
    sheep.y = 32 + (Math.random() * (canvas.height - 87));

    sheep2.x = 32 + (Math.random() * (canvas.width - 94));
    sheep2.y = 32 + (Math.random() * (canvas.height - 87));

    sheep3.x = 32 + (Math.random() * (canvas.width - 94));
    sheep3.y = 32 + (Math.random() * (canvas.height - 87));

    wolf.x = 32 + (Math.random() * (canvas.width - 94));
    wolf.y = 32 + (Math.random() * (canvas.height - 106));
};

// Let's play this game!
let then = Date.now();
reset();
main(); // call the main game loop.
