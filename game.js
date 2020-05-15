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

let bgReady, heroReady, monsterReady, rottenFruitReady, wolfReady;
let bgImage, heroImage, monsterImage, rottenFruitImage, wolfImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let myTime; // timer will be assigned to this variable
let time = 0;

//extra functions
let score = 0;
let level = 1;
//let round = []
let history = [];
let isGameOver = true
//let resetButton = document.getElementById("reset").innerHTML

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
  heroImage.src = "/images/squirrel 32 px.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/fruits/strawberry 32px.png";
  isGameOver=false;

}

function loadRottenFruitImage (){
  rottenFruitImage = new Image();
  rottenFruitImage.onload = function () {
    rottenFruitReady = true;
    } 
  rottenFruitImage.src = "images/rotten fruit pink 32px.png";
};

function loadWolfImage (){
  wolfImage = new Image();
  wolfImage.onload = function () {
    wolfReady = true;
    } 
  wolfImage.src = "images/wolf_32px.png";
};


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

let rottenFruitX = 400;
let rottenFruitY = 300;

let wolfX = 200;
let wolfY = 230;

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
// add more monsters here (under update)
let update = function () {
  // Update the time.
  if(isGameOver){
    return
  }
  //stop timer when it hits 0
  if(elapsedTime >= SECONDS_PER_ROUND){
    console.log("the game is over");
    isGameOver = true;
    //resetButton = true;
    return;
  }

  // this needs to be under the "if" statement so the if statement runs first
  // if condition ends up being false, it will run the formula below
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  // will display the time counter
  document.getElementById('timePassed').innerHTML = `Time Passed: ${elapsedTime}s`;


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
    heroY = 480
  } 
  if (heroY > canvas.height){
    heroY = 0
  }
  if(heroX<0){
    heroX = 512
  }
  if (heroX > canvas.width){
    heroX = 0
  }

  //displays level 
  document.getElementById("levelArea").innerHTML = `Level: ${level}`

  // MAIN "ACTION" FUNCTION
  // If hero touches monster, monster will change location. 
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
    ) {
    // Pick a new random location for the monster.
    monsterX = Math.floor(Math.random()*(canvas.width-32)) // places boundaries
    monsterY = Math.floor(Math.random()*(canvas.height-32))
    score++;
    
    //level up
    level = 1 + (Math.floor(score / 3));

    // move the rotten fruit
    // rottenFruitX = Math.floor(Math.random()*(canvas.width-32)) 
    // rottenFruitY = Math.floor(Math.random()*(canvas.height-32))

    // // move the wolf -- NEED TO ANIMATE THIS
    // wolfX = Math.floor(Math.random()*(canvas.width-32)) 
    // wolfY = Math.floor(Math.random()*(canvas.height-32))

    // level 2 difficulty - enter rotten fruit
    if (level >= 2 && level < 3){
      loadRottenFruitImage();
      rottenFruitX = Math.floor(Math.random()*(canvas.width-32)) 
      rottenFruitY = Math.floor(Math.random()*(canvas.height-32))
      document.getElementById("levelWarning").innerHTML = `Watch out for the rotten fruit! Catching one will subtract your score.`
    }

    // level 3 difficulty - enter wolf
    if (level >= 3){
      loadWolfImage();
      wolfX = Math.floor(Math.random()*(canvas.width-32)) 
      wolfY = Math.floor(Math.random()*(canvas.height-32))
      document.getElementById("levelWarning").innerHTML = `Here comes the wolf! Running into it will end the game.`
    }


  }

  // SUBTRACT POINTS IF HERO TOUCHES ROTTEN FRUIT
  if (
    heroX <= (rottenFruitX + 32)
    && rottenFruitX <= (heroX + 32)
    && heroY <= (rottenFruitY + 32)
    && rottenFruitY <= (heroY + 32)
    ) {
      console.log("rotten fruit game")
      score--;
      rottenFruitX = Math.floor(Math.random()*(canvas.width-32)) 
      rottenFruitY = Math.floor(Math.random()*(canvas.height-32))
    }

  // END GAME IF HERO TOUCHES WOLF
  // if (
  //   heroX <= (wolfX + 32)
  //   && wolfX <= (heroX + 32)
  //   && heroY <= (wolfY + 32)
  //   && wolfY <= (heroY + 32)
  //   ) {
  //     console.log("wolf end game")
  //     // endGame();
  //     return;
  //   }

  //this means every time the render updates, it will move the monster +3
  // monsterX +=3
  // monsterY +=3



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
  if (rottenFruitReady) {
    ctx.drawImage(rottenFruitImage, rottenFruitX, rottenFruitY);
  }
  if (wolfReady) {
    ctx.drawImage(wolfImage, wolfX, wolfY);
  }
  //ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100); //fillText is to draw image inside canvas // also has text you want to show
  //ctx.fillText(`Score: ${score}`, 20, 150); //fillText is to draw image inside canvas // also has text you want to show
  //(20,150) above is the location of the text
  
  //put time & score outside of the game
  document.getElementById("timeRemainingArea").innerHTML = `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`;
  document.getElementById("scoreArea").innerHTML = `Score: ${score}`;

  //time out
  // if(elapsedTime <= 0){
  //   timeOut();
  // }
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
  console.log("Reset Game")

  //call the timer again
  startTime = Date.now();
  SECONDS_PER_ROUND
  elapsedTime = 0
  score = 0;
  level = 1;
  isGameOver = false;

  // reset the UI
  loadImages();
  setupKeyboardListeners();
  main();
  update;


  // add char + monster reset here
  heroX = canvas.width / 2;
  heroY = canvas.height / 2;
  monsterX = 100;
  monsterY = 100;


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