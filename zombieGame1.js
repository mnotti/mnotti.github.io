function Zombie(){
	this.x = canvas.width/2;
	this.y = canvas.height/2 - 50;
	this.speed = 256;
}

function EvilZombie(){
	this.x = Math.floor(Math.random() * (canvas.width - 30) + 1);
	this.y = Math.floor(Math.random() * (canvas.height - 30) + 1);
	this.speed = (Math.random() * 2) + 1;
	this.oppositeDir = 0;
	this.toMove = 0;
}

function Brain(){
	this.x = Math.floor(Math.random() * (canvas.width - 30) + 1);
	this.y = Math.floor(Math.random() * (canvas.height - 30) + 1);
}

function spawnZombie(){
	evilZomb = new EvilZombie();
	evilZombs.push(evilZomb);
	nZombs++;
	alreadyAdded = true;
}

//makes zombies take unorthodox routes
//changes toMove and dir to move
function chaos(zomb){
	if(Math.random() < 0.1){
		zomb.toMove = Math.floor(Math.random()*20 + 1);
		if(Math.random() < 0.5){
			zomb.oppositeDir = 0;
		}
		else{
			zomb.oppositeDir = 1;
		}
	}
}

//move to location between brain and zombie
function decideDir(zomb){
	
	var x = 0, y = 0;

	if(zomb.toMove == 0){
		chaos(zomb);
	}

	if(zomb.x >= mainZomb.x){
		x = 0;
	}
	else{
		x = 1;
	}

	//if the direction to move opposite is X and the zombie still has opposite moves
	if(!zomb.oppositeDir && zomb.toMove > 0/* && Math.abs((zomb.x - mainZomb.x) > 15)*/){
		x = !x;
		zomb.toMove--;
	}

	if(zomb.y >= mainZomb.y){
		y = 0;
	}
	else{
		y = 1;
	}

	//if the direction to move opposite is X and the zombie still has opposite moves
	if(zomb.oppositeDir && zomb.toMove > 0 /*&& Math.abs((zomb.y - mainZomb.y) > 15)*/){
		y = !y;
		zomb.toMove--;
	}

	var dir = [x, y];
	return dir;
}


function renderFrame(){
	if (bgImageReady){
		ctx.drawImage(bgImage, 0, 0, 512, 512);
	}
	if (zombieImageReady){
		ctx.drawImage(zombieImage, mainZomb.x, mainZomb.y, 30, 30);
	}
	if (brainImageReady){
		ctx.drawImage(brainImage, brain.x, brain.y);
	}
	if (evilZombieImageIsReady){
		for (var i = 0; i < nZombs; i++){
			ctx.drawImage(evilZombieImage, evilZombs[i].x, evilZombs[i].y, 40, 40);
		}
	}
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Brains Snacked On: " + brainsSnacked, 12, 12);

	if(paused){
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "12px Helvetica";
		ctx.textAlign = "center";
		ctx.fillText("Press Space to Continue Snacking on Brains...", canvas.width/2, canvas.height/2);
	}
}

function update (modifier) {

	//modifier is for the length of time the key is being pressed
	if (38 in keysDown) { // Player holding up
		mainZomb.y -= mainZomb.speed * modifier;
		if (mainZomb.y < 1){
			mainZomb.y = 1;
		}

	}
	if (40 in keysDown) { // Player holding down
		mainZomb.y += mainZomb.speed * modifier;
		if (mainZomb.y > canvas.height-30){
			mainZomb.y = canvas.height-30;
		}
	}
	if (37 in keysDown) { // Player holding left
		mainZomb.x -= mainZomb.speed * modifier;
		if (mainZomb.x < 1){
			mainZomb.x = 1;
		}
	}
	if (39 in keysDown) { // Player holding right
		mainZomb.x += mainZomb.speed * modifier;
		if (mainZomb.x > canvas.width-30){
			mainZomb.x = canvas.width-30;
		}
	}

	if (Math.abs(mainZomb.x - brain.x) <= 20 && Math.abs(mainZomb.y - brain.y) <= 20){
		brainsSnacked++;
		delete brain;
		brain = new Brain();
	}

	for (var i = 0; i < nZombs; i++) {
   		if (Math.abs(mainZomb.x - evilZombs[i].x) <= 20 && Math.abs(mainZomb.y - evilZombs[i].y) <= 20){
			gameOver();
			break;
		}
		else{

			var dir = decideDir(evilZombs[i]);

			//should move in the +x dir
			if (dir[0]){
				evilZombs[i].x += evilZombs[i].speed;
			}
			else{
				evilZombs[i].x -= evilZombs[i].speed;
			}
			if (dir[1]){
				evilZombs[i].y += evilZombs[i].speed;
			}
			else{
				evilZombs[i].y -= evilZombs[i].speed;
			}
		}
	}
}

function main() {

	var now = Date.now();
	var delta = now - then;

	//add zombie if %5 reached...
	if (brainsSnacked%5 == 0 && !alreadyAdded){
		spawnZombie();
	}
	else if(brainsSnacked%5 == 1){
		alreadyAdded = false;
	}


	//update the gameplay
	if(!paused)
		update(delta / 1000);
	renderFrame();

	then = now;

	//render a new frame
	requestAnimationFrame(main);
};

function gameOver(){
	delete brain;
	delete mainZomb;
	for(var i = 0; i < nZombs; i++){
		delete evilZombs[0];
	}
	for(var i = 0; i < nZombs; i++){
		evilZombs.splice(i, 1);
	}
	nZombs = 0;
	brainsSnacked = 0;
	brain = new Brain();
	mainZomb = new Zombie();
	alreadyAdded = false;
	spawnZombie();
	paused = !paused;

}


//make requestAnimationFrame compatible with other browsers
var w = window;

//prevents the window from scrolling on arrow keys and spacebar
w.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");


mainZomb = new Zombie();
brain = new Brain();
var brainsSnacked = 0;

//setting up evil zombie array
var evilZombs = [];
var nZombs = 0;
var alreadyAdded = false;

var paused = true;


//set up the background...
var bgImage = new Image();
var bgImageReady = false;
bgImage.onload = function(){
	bgImageReady = true;
};
bgImage.src = "images/grassyBg1.jpeg";

//set up the player's zombie image...
var zombieImage = new Image();
var zombieImageReady = false;
zombieImage.onload = function(){
	zombieImageReady = true;	
};
zombieImage.src = "images/stickZomb.gif";

var evilZombieImage = new Image();
var evilZombieImageIsReady = false;
evilZombieImage.onload = function(){
	evilZombieImageIsReady = true;
};
evilZombieImage.src = "images/badZombie1.gif";

//set up the brain's image...
var brainImage = new Image();
var brainImageReady = false;
brainImage.onload = function(){
	brainImageReady = true;	
};
brainImage.src = "images/brain.png";

//render initial gameplay frame 
//
//renderFrame();

//set up listeners for key presses
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	if(e.keyCode == 32){
		paused = !paused;
	}
});

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
});

//begin game
main();
