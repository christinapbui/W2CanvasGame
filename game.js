/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let myTime; // timer will be assigned to this variable

//extra functions
let score = 0;
let level = 1;
//let round = []
let history = [];

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/child 32px.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/fruits/strawberry 32px.png";

  // add rotten fruit here for proceeding levels
}

/** 
 * Setting up our characters.
 * 
 * heroX = X position of our hero.
 * heroY = Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

/** 
 * Keyboard Listeners: ignore
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
    
  //stop timer when it hits 0
  if(elapsedTime >= SECONDS_PER_ROUND){
    return;
  }

  // this needs to be under the "if" statement so the if statement runs first
  // if condition ends up being false, it will run the formula below
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (38 in keysDown) { // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown) { // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 5;
  }

  //this places boundaries on hero
  if(heroY<0){
    heroY = 0
  } else if (heroY > canvas.height-32){
    heroY = canvas.height-32
  }
  //this function doesn't work--FIX LATER//
  // if(heroX<0){
  //   heroY = 0
  // } else if (heroY > canvas.width-32){
  //   heroX = canvas.width-32
  // }

  // MAIN "ACTION" FUNCTION
  // If hero touches monster, monster will change location. Our images are 32 px big.
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    // Pick a new random location for the monster.
    monsterX = Math.floor(Math.random()*(canvas.width-32)) // places boundaries
    monsterY = Math.floor(Math.random()*(canvas.height-32))
    // console.log("monsterX",monsterX); // putting this inside the "If" statement so we can capture it in console
    // console.log("monsterY",monsterY);
    score++;
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  //ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100); //fillText is to draw image inside canvas // also has text you want to show
  //ctx.fillText(`Score: ${score}`, 20, 150); //fillText is to draw image inside canvas // also has text you want to show
  //(20,150) above is the location of the text
  
  //put time & score outside of the game
  document.getElementById("timeRemainingArea").innerHTML = `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`;
  document.getElementById("scoreArea").innerHTML = `Score: ${score}`;

  //time out
  if(elapsedTime <= 0){
    timeOut();
  }
}; // $ function is to calculate the time

document.getElementById("timeRemainingArea").innerHTML = `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`;
document.getElementById("scoreArea").innerHTML = `Score: ${score}`;

// time out 
function timeOut() {
  clearInterval(myTime);
}

// submit and save user's name // LOOK AT AGAIN
function display(){
  let userName = document.getElementById("inputName").value;
  document.getElementById("displayName").innerHTML = `Player Name: ${userName}`;
  document.getElementById("inputName").value = '';
}

function reset(){
  // reset the value 
  elapsedTime = 0

  // reset the UI

  // call the timer again
}


/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update(); 
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();

function endGame() {
  // if timer hits 0, stop action of hero

}