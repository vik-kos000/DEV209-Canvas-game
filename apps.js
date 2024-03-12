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

// Hero image
let heroReady = false;
let heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

//creating a new hero using sprite sheet
let heroSheetReady = false; 
let herosheetImage = new Image();
herosheetImage.onLoad = function(){
    heroSheetReady= true;
}
herosheetImage.src = "images/mainGuy.png"; 
//define dimension of each frame
let frameWidth = 100;
let frameHeight = 100; 
//define current frame index and direction of the hero
let currentFrameIndex = 0;
let direction = "down"; //initial direction
//  END of HERO using sprite sheet

// Monster image
let monsterReady = false;
let monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

//========= end of creating image objects =====================

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

//================ done creating other variables =================

// Handle keyboard controls
let keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down. In our game loop, we will move the hero image if when
// we go thru render, a key is down
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
    if (38 in keysDown && hero.y > 32 + 0) { // holding up key
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (64 + 0)) { // holding down key
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (32 + 0)) { // holding left key
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (64 + 0)) { // holding right key
        hero.x += hero.speed * modifier;
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
};

// Draw everything in the main render function
let render = function () {

    if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
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