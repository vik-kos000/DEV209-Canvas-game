// create a canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
let bgReady = false;
let bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

let heroReady = false;
let heroImage = new Image();
heroImage.onload = function(){
    heroReady = true;
};
//changing hero images to sprite sheet
heroImage.src = "images/mainGuy_resize.png"; //using the mainGuy

//adding sprite sheet variables
var rows = 4; //sprite sheet has 4 rows
var cols = 6; //spite sheet has 6 columns

//second row for left movement counting from index 0
var trackLeft = 2; 
//third row for right movement counting from index 0
var trackRight = 1; 
var trackUp = 3; //not using up and down 
var trackDown = 0; // might have to change

var spriteWidth =289;
var spriteHeight = 192; 
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
var down =true; 

// Monster image
let monsterReady = false;
let monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
let hero = {
    speed: 150, // movement in pixels per second
    x: 0, // where on the canvas are they?
    y: 0 // where on the canvas are they?
};
let monster = {
    // for this version, the monster does not move, so just and x and y
    x: 0,
    y: 0
};
let monstersCaught = 0;

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

// Update game objects
let update = function (modifier) {
    //update code for sprite

    //clear last hero image position and assume he is not moving left or right 
    ctx.clearRect(hero.x, hero.y, width, height);
    left = false; 
    right = false; 

    // decide if they are moving left or right and set those 
    if (37 in keysDown && hero.x > (32 + 4)){ //holding left key
        hero.x -= hero.speed * modifier;
        left = true; //for animation
        right = false; // for animation
    }

    if (39 in keysDown && hero.x < canvas.width + (96 + 2)){
        //holding right key
        hero.x += hero.speed * modifier;
        left = false;//for animation 
        right = true;// for animation
    }
    if (38 in keysDown && hero.y > 0) { // Up key
        hero.y -= hero.speed * modifier;
        up = true;
        down = false; 
    }
    if (40 in keysDown && hero.y < canvas.height - height) { // Down key
        hero.y += hero.speed * modifier;
        down = true;
        up = false; 
    }

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught; // keep track of our “score”
        reset(); // start a new cycle
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
    // Draw the monster
    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
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
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
}



// The main game loop
let main = function () {
    //stopping the game after 10 points
    if (monstersCaught>=10){
        alert("Game Over, Press F5 to play again")
        return; // stopping the game
    }

    let now = Date.now();
    let delta = now - then;
    update(delta / 1100);
    render();
    then = now;
    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Reset the game when the player catches a monster
let reset = function () {
    hero.x = (canvas.width / 2) - 16;
    hero.y = (canvas.height / 2) - 16;
    //Place the monster somewhere on the screen randomly
    // but not in the hedges, Article in wrong, the 64 needs to be
    // hedge 32 + hedge 32 + char 32 = 96
    monster.x = 32 + (Math.random() * (canvas.width - 96));
    monster.y = 32 + (Math.random() * (canvas.height - 96));
};

// Let's play this game!
let then = Date.now();
reset();
main(); // call the main game loop.
