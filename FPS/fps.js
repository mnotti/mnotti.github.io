/*
Questions for TA:
	- rotating the ship with mouse? if i do it with animation delta time, could get super laggy
		- send garret a video?
	- missiles with curved path

TODO:
	- add pew pew sounds x
	- add explosion sounds x 
	- stars x
	- sun as light source x
	- different color aliens... random x 
		- more aliens? x 
	- aliens fly into space after blowing up the planet x
	- stars in the background: 
		- continually spawn with same x, y values, change z value to always be constant amount away


	- collision detection and explosion of ship x
	- aliens flying off into space x
	- teleporting x

	- dynamically generating the asteroids and the stars
	- spaceship flips (a and d keys)

	- spaceship makes tiny explosion on suface of sun if too close
		- zoom out and little poof
*/




// *******************************************************
// CS 174a Graphics Example Code
// animation.js - The main file and program start point.  The class definition here describes how to display an Animation and how it will react to key and mouse input.  Right now it has 
// very little in it - you will fill it in with all your shape drawing calls and any extra key / mouse controls.  


"use strict"
var canvas, 
	canvas_size, 
	gl = null, 
	g_addrs;

var	movement = vec2(),	
	thrust = vec3(0,0,1), 
	rotV = vec4(0, 0, 0, 0), 	
	looking = true, 
	prev_time = 0, 
	animate = true, 
	animation_time = 0,
	projectiles = [],
	sanics = [],
	audioObjects = [],
	stars = [],
	floatingAliens = [],
	starsSpawned = false,
	nStars = 150,
	fired = false,
	projectileV = 0.2;

var flipping = false,
	flipDir = 1,
	flipStartTime = 0,
	moving = true,
	movingFast = false,
	warp = false,
	curShipRot = 0;

//ship collision vertices:
var cv1 = vec4(),
	cv2 = vec4(),
	cv3 = vec4(),
	cv4 = vec4(),
	cv5 = vec4(),
	cv6 = vec4();

//asteroid constants
var asteroids = [],
	astPieces = [],
	spawned = false,
	distToPortal = 300,
	widthOfField = 25,
	heightOfField = 25,
	extensionOfField = 25,
	nAsteroids = 80,
	nAstPieces = 30,
	astsDestroyed = 0,
	astPieceV = 0.1;

var floatingAlienV = 0.001;

var cannonLmt = mat4(),
	cannonRmt = mat4();

var gameOver = false,
	timeOfExplosion = 0,
	astCausesExplosion = true,
	shipExploded = false,
	canLose = true,
	pause = false,
	gamePlay = false,
	audioInit = false;

var gouraud = false, 
	color_normals = false, 
	solid = false, 
	fps = 0, 
	debugging = false;

function CURRENT_BASIS_IS_WORTH_SHOWING(self, model_transform) { self.m_axis.draw( self.basis_id++, self.graphicsState, model_transform, new Material( vec4( .8,.3,.8,1 ), .5, 1, 1, 40, "" ) ); }


// *******************************************************
// IMPORTANT -- In the line below, add the filenames of any new images you want to include for textures!

var texture_filenames_to_load = ["text.png", "images/portal.png", "images/sanic1.png", "images/sstexture3.jpg", "images/shiptexture1.jpeg" ];

// *******************************************************	
// When the web page's window loads it creates an "Animation" object.  It registers itself as a displayable object to our other class "GL_Context" -- which OpenGL is told to call upon every time a
// draw / keyboard / mouse event happens.

window.onload = function init() {	var anim = new Animation();	}
function Animation()
{
	( function init (self) 
	{
		//audio attempt

		self.context = new GL_Context( "gl-canvas" );
		self.context.register_display_object( self );
		
		gl.clearColor( 0, 0, 0, 1 );			// Background color
		
		for( var i = 0; i < texture_filenames_to_load.length; i++ )
			initTexture( texture_filenames_to_load[i], true );
		
		self.m_cube = new cube();
		self.m_axis = new axis();
		self.m_sphere = new sphere( mat4(), 4 );	
		self.m_fan = new triangle_fan_full( 10, mat4() );
		self.m_strip = new rectangular_strip( 1, mat4() );
		self.m_cylinder = new cylindrical_strip( 10, mat4() );
		self.m_tetra = new tetrahedron();
		self.m_spaceShip = new spaceShipBase();
		self.m_asteroid = new asteroid();
		self.m_text_line = new text_line(13);
		self.m_text_go = new text_line(4);

		// 1st parameter is camera matrix.  2nd parameter is the projection:  The matrix that determines how depth is treated.  It projects 3D points onto a plane.
		self.graphicsState = new GraphicsState( translation(0, 0,-40), perspective(45, canvas.width/canvas.height, .1, 1000), 0 );

		gl.uniform1i( g_addrs.GOURAUD_loc, gouraud);		gl.uniform1i( g_addrs.COLOR_NORMALS_loc, color_normals);		gl.uniform1i( g_addrs.SOLID_loc, solid);
		
		self.context.render();	
	} ) ( this );	
	
	canvas.addEventListener('mousemove', function(e)	{		e = e || window.event;		movement = vec2( e.clientX - canvas.width/2, e.clientY - canvas.height/2, 0);	});
}

// *******************************************************	
// init_keys():  Define any extra keyboard shortcuts here
Animation.prototype.init_keys = function()
{
	
	shortcut.add( "s",     function() { movingFast = true; if (thrust[2] < 2) thrust[2]*=2;} );			shortcut.add( "s",     function() { movingFast = false; thrust[2]=1 }, {'type':'keyup'} );
	shortcut.add( "f", 	   function() { if (!warp) fired = true;  } );
	shortcut.add( "w",     ( function(self) { return function() { warp = true; movingFast = true; if (thrust[2] < 16) thrust[2]*=1.1;
			self.sanicAudio.play() }; } ) (this) );		
	
	shortcut.add( "w",   ( function(self) { 
		return function() { 
			warp = false; 
			movingFast = false; 
			thrust[2]=1; 
			sanics = [];
			self.sanicAudio.pause(); 
			self.sanicAudio.currentTime = 0; 
		}; } ) (this) , {'type':'keyup'} );

	shortcut.add( "a",     ( function(self) { 
		return function() { 
			if (!flipping) 
				flipping = true; 
				flipStartTime = self.graphicsState.animation_time;
				flipDir = -1; 
		}; } ) (this) , {'type':'keyup'} );

	shortcut.add( "d",     ( function(self) { 
		return function() { 
			if (!flipping) 
				flipping = true; 
				flipStartTime = self.graphicsState.animation_time;
				flipDir = 1; 
		}; } ) (this) , {'type':'keyup'} );


	shortcut.add( "ALT+d", function() { debugging = !debugging} );
	shortcut.add( "ALT+a", function() { animate = !animate; } );
	shortcut.add( "ALT+p", function() { pause = !pause; } );


	}

function update_camera( self, animation_delta_time ){
		if (!gameOver){
			var leeway = 70, border = 50;
			var degrees_per_frame = .0002 * animation_delta_time;
			var meters_per_frame  = .01 * animation_delta_time;
																						// Determine camera rotation movement first
			var movement_plus  = [ movement[0] + leeway, movement[1] + leeway ];		// movement[] is mouse position relative to canvas center; leeway is a tolerance from the center.
			var movement_minus = [ movement[0] - leeway, movement[1] - leeway ];
			var outside_border = false;
			
			//for( var i = 0; i < 2; i++ )
				//if ( Math.abs( movement[i] ) > canvas_size[i]/2 - border )	outside_border = true;		// Stop steering if we're on the outer edge of the canvas.

			for( var i = 0; looking && outside_border == false && i < 2; i++ )			// Steer according to "movement" vector, but don't start increasing until outside a leeway window from the center.
			{
				var velocity = ( ( movement_minus[i] > 0 && movement_minus[i] ) || ( movement_plus[i] < 0 && movement_plus[i] ) ) * degrees_per_frame;	// Use movement's quantity unless the &&'s zero it out
				self.graphicsState.camera_transform = mult( rotation( velocity, i, 1-i, 0 ), self.graphicsState.camera_transform );			// On X step, rotate around Y axis, and vice versa.
			}

			self.graphicsState.camera_transform = mult( translation( scale_vec( meters_per_frame, thrust ) ), self.graphicsState.camera_transform );		// Now translation movement of camera, applied in local camera coordinate frame
		
			
			//todo: scale movement according to time
			var rotVScaled = scale_vec( meters_per_frame, vec4(5, 0, 1, 0)) ;
			if (rotV[0] != 0)
				if (rotV[2] > 0)
					self.graphicsState.camera_transform = mult( rotation(rotVScaled[0], 0, 1, 0), self.graphicsState.camera_transform );		// Now translation movement of camera, applied in local camera coordinate frame
				else if(rotV[2] < 0)
					self.graphicsState.camera_transform = mult( rotation(rotVScaled[0], 0, -1, 0), self.graphicsState.camera_transform );		// Now translation movement of camera, applied in local camera coordinate frame

	}
}

// *******************************************************	

Animation.prototype.viewAlien = function(){
	var astMt = asteroids[0]["model_transform"];

	this.writeTitle(astMt);

	var astPosition4 = VmultM(vec4(0, 0, 0, 1), astMt);
	var astPosition3 = vec3(astPosition4);
	var degreesToRot = this.graphicsState.animation_time * 0.04 * (Math.PI/180);
	var cameraPosition = vec3(astPosition3[0] + 10*Math.cos(degreesToRot), astPosition3[1], astPosition3[2] + 10*Math.sin(degreesToRot));
	var upVec = vec3(0, 1, 0);
	this.graphicsState.camera_transform = lookAt(cameraPosition, astPosition3, upVec);
}

Animation.prototype.drawPortal = function(model_transform, portalMat){
	model_transform = mult( model_transform, translation( 0, 0, -distToPortal ) );
	model_transform = mult(model_transform, scale(2, 2, 0.00001));
	model_transform = mult( model_transform, rotation( this.graphicsState.animation_time/2 , 0, 0, -1 ) );
	this.m_cube.draw(this.graphicsState, model_transform, portalMat);

	var coordVector = VmultM(vec4(0, 0, 0, 1), model_transform);
	if (this.collidedWithShip(coordVector, 2)){
		this.resetGame();
	}
}

Animation.prototype.fireCannon = function(mt){

	var mt = mult(mt, translation(0, 0, -5));
	projectiles.push({"model_transform" : mt, "distance" : 0});
	var laserAudio = new Audio('sounds/pew3.m4a');
	laserAudio.play();
	audioObjects.push({"obj" : laserAudio, "timeOfSound" : this.graphicsState.animation_time});

}

Animation.prototype.update_And_Draw_Projectiles = function(material){
	//enumerates thru global projectiles array and updates elements coords based on velocity and animation time
	//would have a global projectileV variable
	var toRemove = [];

	var len = projectiles.length;
	for (var i = 0; i < len; i++){
		//access projectile objects and draw
		var mt = projectiles[i]["model_transform"];
		var d = projectileV * this.animation_delta_time;

		mt = mult(mt, translation(0, 0, d));
		projectiles[i]["model_transform"] = mt;
		this.m_sphere.draw(this.graphicsState, mt, material);

		//update distance
		projectiles[i]["distance"] += d;
		if (projectiles[i]["distance"] > 600)
			toRemove.push(i);
	}

	len = toRemove.length;
	for (var i = 0; i < len; i++){
		//remove all indices that have gone out of range
		projectiles.splice(toRemove[i] - i, 1);
	}

}

Animation.prototype.update_And_Draw_Asteroids = function(material, shipMT, alienBody, alienEyes, alienEars, matteBlack){
	//enumerates thru global asteroids coords array and updates elements coords based on velocity and animation time
	//global asteroids array would have extra rotational velocity because they'll be rotating like muthafuckas
	astsDestroyed = 0;
	var len = asteroids.length;
	for (var i = 0; i < len; i++){

		var ast = asteroids[i - astsDestroyed];
		if (ast != null){
			if ('model_transform' in ast){
				var mt = ast["model_transform"];
				var tx = ast["dx"] * ast["velocity"] * this.animation_delta_time;
				var ty = ast["dy"] * ast["velocity"] * this.animation_delta_time;
				var tz = ast["dz"] * ast["velocity"] * this.animation_delta_time;

				//draw the asteroid
				mt = mult(mt, translation(tx, ty, tz));
				if (gamePlay)
					mt = mult(mt, rotation(ast["rotMag"], ast["rotAxis"] == 0, ast["rotAxis"] == 1, ast["rotAxis"] == 2));
				this.m_asteroid.draw(this.graphicsState, mt, material);

				if (ast["alien"]){
					//draw alien if present
					var mt_alien = mt;
					var asF = 0.05; //alien speed factor
					//var rotFactor = 57;
					var t_alien = (this.graphicsState.animation_time * asF) % 360;
					mt_alien = mult(mt_alien, translation(0, 2*Math.cos(t_alien *(Math.PI / 180)), 2*Math.sin(t_alien*(Math.PI / 180)) ));
					mt_alien = mult(mt_alien, rotation(t_alien, 1, 0, 0));
					if (ast["color"] == 1)
						this.drawAlien(0.25, mt_alien, alienBody, alienEyes, alienEars, matteBlack);
					else
						this.drawAlien(0.25, mt_alien, alienEars, alienBody, alienEyes, matteBlack);
				}


				//now update the position
				var coordVector = VmultM(vec4(1, 1, 1, 1), mt);
				ast["x"] = coordVector[0],
				ast["y"] = coordVector[1],
				ast["z"] = coordVector[2];

				var coordVectorShip = VmultM(vec4(1, 1, 1, 1), mult(shipMT, translation(0, -1, -1)));

				if (this.collidedWithShip(coordVector, 2) && !gameOver && canLose){
					gameOver = true;
					timeOfExplosion = this.graphicsState.animation_time;
					console.log("game over");
					astCausesExplosion = true;
				}

				var hit = false;	//if this asteroid was hit
				var projLen = projectiles.length;
				for (var j = 0; j < projLen && !hit; j++){
					var coordVectorProj  = VmultM(vec4(1, 1, 1, 1), projectiles[j]["model_transform"]);
					if (vecDistance(coordVector, coordVectorProj) < 2.5){
							this.asteroidExplosion(ast["model_transform"], ast["alien"], ast["color"]);
							asteroids.splice(i - astsDestroyed, 1);
							astsDestroyed++;
							hit = true;
							continue;
					}

				}
				if (!hit){
					ast["model_transform"] = mt;
					asteroids[i - astsDestroyed] = ast;
				}
			}
		}
	}
}

Animation.prototype.update_And_Draw_Ast_Pieces = function(astMat, shipMat, fireMat){
	var toRemove = [];
	var len = astPieces.length;
	for (var i = 0; i < len; i++){
		var astPiece = astPieces[i];
		if (this.graphicsState.animation_time - astPiece["spawnTime"] > 3000){
			toRemove.push(i);
		}
		else{
			var v = astPiece["velocity"];
			var c = this.animation_delta_time * astPieceV;
			astPiece["model_transform"] = mult(astPiece["model_transform"], translation(v[0]*c, v[1]*c, v[2]*c));
			astPiece["model_transform"] = mult(astPiece["model_transform"], scale(0.95, 0.95, 0.95));
			if (astPiece["type"] == "asteroid")
				this.m_asteroid.draw(this.graphicsState, astPiece["model_transform"], astMat);
			else if (astPiece["type"] == "ship")
				this.m_asteroid.draw(this.graphicsState, astPiece["model_transform"], shipMat);
			else
				this.m_asteroid.draw(this.graphicsState, astPiece["model_transform"], fireMat);
			astPieces[i] = astPiece;
		}
	}

	len = toRemove.length;
	for (var i = 0; i < len; i++){
		astPieces.splice(toRemove[i] - i, 1);
	}
}

Animation.prototype.update_And_Draw_Floating_Aliens = function(body, eyes, ears, mouth){
	var toRemove = [];
	var len = floatingAliens.length;
	for (var i = 0; i < len; i++){
		var alien = floatingAliens[i];
		var shrinking = false;
		if (this.graphicsState.animation_time - alien["spawnTime"] > 3000){
			shrinking = true;
		}
		if(this.graphicsState.animation_time - alien["spawnTime"] < 6000){
			var v = alien["velocity"];
			var c = this.animation_delta_time * floatingAlienV;
			alien["model_transform"] = mult(alien["model_transform"], translation(v[0]*c, v[1]*c, v[2]*c));
			if (shrinking)
				alien["model_transform"] = mult(alien["model_transform"], scale(0.95, 0.95, 0.95));
			if (alien["color"] == 1)
				this.drawAlien(0.25, alien["model_transform"], body, eyes, ears, mouth);
			else
				this.drawAlien(0.25, alien["model_transform"], ears, body, eyes, mouth);

			floatingAliens[i] = alien;
		}
		else
			toRemove.push(i);
	}

	len = toRemove.length;
	for (var i = 0; i < len; i++){
		floatingAliens.splice(toRemove[i] - i, 1);
	}
}
Animation.prototype.asteroidExplosion = function(mt, alien, color){
	var a_mt = mult(mt, scale(1, 1, 1));
	mt = mult(mt, scale(0.1, 0.1, 0.1));
	for (var i = 0; i < nAstPieces; i++){
		var v = [Math.random()*2, Math.random()*2, Math.random()*2];
		if (Math.random() < 0.5)
			v[0] = -v[0];
		if (Math.random() < 0.5)
			v[1] = - v[1];
		if (Math.random() < 0.5)
			v[2] = - v[2];
		astPieces.push({"model_transform" : mt, 
							"velocity" : v,
							"spawnTime" : this.graphicsState.animation_time, 
							"type" : "asteroid"
							});
	}
	//create floating alien if there's an alien on that asteroid
	if (alien){
		var av = [Math.random()*2, Math.random()*2, Math.random()*2];
		if (Math.random() < 0.5)
			av[0] = -av[0];
		if (Math.random() < 0.5)
			av[1] = - av[1];
		if (Math.random() < 0.5)
			av[2] = - av[2];
		floatingAliens.push({"model_transform" : a_mt, 
							"velocity" : av,
							"spawnTime" : this.graphicsState.animation_time, 
							"color" : color
							});
	}

	this.playRandomExplosionSound();

}

Animation.prototype.playRandomExplosionSound = function(){
	var randExplosionSound = '';
	if (Math.random() > 0.66)
		randExplosionSound = "explosion1";
	else if (Math.random() >= 0.33)
		randExplosionSound = "explosion2";
	else
		randExplosionSound = "explosion3";

	var explosionAudio = new Audio('sounds/' + randExplosionSound + '.m4a');
	explosionAudio.play();
	audioObjects.push({"obj" : explosionAudio, "timeOfSound" : this.graphicsState.animation_time});
}

Animation.prototype.resetGame = function(){
	this.graphicsState.camera_transform = mat4(); 
	projectiles = [],
	astPieces = [],
	sanics = [],
	audioObjects = [],
	floatingAliens = [],
	gameOver = false;
	shipExploded = false;
}

Animation.prototype.animateRockets = function(engineModelT, flameMat, nFlames){
	for (var i = 0; i < nFlames; i++){
		var mt = mult(engineModelT, scale(0.3, 0.3, 2));
		if (movingFast){
			mt = mult(mt, scale(1.1, 1.1, 2));
		}
		var tfx = (this.graphicsState.animation_time % 13) / 10; //translation factor
		if (Math.random() < 0.5)
			tfx = -tfx;

		var tfy = (this.graphicsState.animation_time % 13) / 10; //translation factor
		if (Math.random() < 0.5)
			tfy = -tfy;

		mt = mult(mt, translation(tfx, tfy, 0));
		//translate by some arbitrary amount and draw new cylinder
		this.m_cylinder.draw(this.graphicsState, mt, flameMat);
	}
}


Animation.prototype.update_spaceShip = function(animation_delta_time, model_transform, bodyMat, rocketMat, cockpitMat, engineMat){
	if (!debugging)
		model_transform = inverse(this.graphicsState.camera_transform);

	model_transform = mult(model_transform, translation (0, -0.3, -1.75));
	model_transform = mult(model_transform, scale (0.3, 0.3, 0.3));
	model_transform = mult(model_transform, rotation (180, 0, 1, 0));
	model_transform = mult(model_transform, rotation (-10, 1, 0, 0));

	//rotation for steering
	if (!flipping){
		if (movement[0] > curShipRot)
			if ((animation_delta_time*0.3 + curShipRot) < movement[0] * 0.3){
				curShipRot = animation_delta_time*0.3 + curShipRot;
				model_transform = mult(model_transform, rotation(curShipRot, 0, 0, 1));	
			}
			else{
				curShipRot = movement[0]*0.3;
				model_transform = mult(model_transform, rotation(curShipRot, 0, 0, 1));
			}
		else{
			if ((-animation_delta_time*0.3 + curShipRot) > movement[0] * 0.3){
				curShipRot = -animation_delta_time*0.3 + curShipRot;
				model_transform = mult(model_transform, rotation(curShipRot, 0, 0, 1));	
			}
			else{
				curShipRot = movement[0]*0.3;
				model_transform = mult(model_transform, rotation(curShipRot, 0, 0, 1));
			}
		}
	}
	else{
		//if flipping:
		//execute a 360 flip:
		var flipTime = this.graphicsState.animation_time - flipStartTime;
		if (flipTime*0.5 < 360){
			model_transform = mult(model_transform, rotation(flipTime*0.5*flipDir + curShipRot, 0, 0, 1));

		}
		else{
			flipping = false;
			curShipRot = 0;
		}

	}

	//model_transform = mult(model_transform, rotation(movement[1], 1, 0, 0));

	if(!gameOver)
		this.m_spaceShip.draw(this.graphicsState, model_transform, bodyMat);


	model_transform = mult(model_transform, scale(0.1, 0.1, 1));
	var centeredMT = model_transform;
	model_transform = mult(model_transform, scale(0.5, 0.5, 1));

	if(!gameOver){
		//cannonR
		model_transform = mult(model_transform, translation(5, 0, 1));
		cannonRmt = model_transform;

		this.m_cylinder.draw(this.graphicsState, model_transform, bodyMat);

		//cannonL
		model_transform = mult(model_transform, translation(-10, 0, 0));
		cannonLmt = model_transform;
		this.m_cylinder.draw(this.graphicsState, model_transform, bodyMat);

		//drawing the cockpit
		model_transform = centeredMT;
		model_transform = mult(model_transform, translation(0, 5.2, -0.4));
		model_transform = mult(model_transform, scale(4, 1.5, 1));
		model_transform = mult(model_transform, translation(0, -2/1.5, 0));
		this.m_cube.draw(this.graphicsState, model_transform, cockpitMat);

		//drawing engineR
		model_transform = centeredMT;
		model_transform = mult(model_transform, translation(-3, 2, -1));
		model_transform = mult(model_transform, scale(1, 1, 0.3));
		model_transform = mult(model_transform, translation(0, -0.2, -0.2));
		this.m_cylinder.draw(this.graphicsState, model_transform, engineMat);

		//animate rocket R
		if (moving)
			this.animateRockets(model_transform, rocketMat, 5);


		//drawing engineL
		model_transform = centeredMT;
		model_transform = mult(model_transform, translation(3, 2, -1));
		model_transform = mult(model_transform, scale(1, 1, 0.3));
		model_transform = mult(model_transform, translation(0, -0.2, -0.2));
		this.m_cylinder.draw(this.graphicsState, model_transform, engineMat);

		//animate rocket L
		if (moving)
			this.animateRockets(model_transform, rocketMat, 5);
	}
	//this.printMat(centeredMT);
	return mult(centeredMT, scale(1, 1, 0.1));



}

Animation.prototype.collidedWithShip = function(coordVector, dist){
	var objectPoint = coordVector;

	if (vecDistance(objectPoint, cv1) < dist
		|| vecDistance(objectPoint, cv2) < dist
		|| vecDistance(objectPoint, cv3) < dist
		|| vecDistance(objectPoint, cv4) < dist
		|| vecDistance(objectPoint, cv5) < dist
		|| vecDistance(objectPoint, cv6) < dist
		)
		return true;
	else
		return false;



}


Animation.prototype.spawnAsteroids = function(mt){

	var t = this.graphicsState.animation_time % 100;

	if (spawned == false){
		for (var j = 0 ; j < nAsteroids; j++){
			var rotAxis = 0; 
			var rotMag = 1;
			var v = 0.01;
			var px = Math.random() * (widthOfField);
			var py = Math.random() * (heightOfField);
			var pz = -(Math.random() * (distToPortal));
			var dx = 1;
			var dy = 1;
			var dz = 1;

			//randomize the velocity of the asteroid
			v *= Math.random();

			//randomize the location around the spaceship
			if (Math.random() < 0.5)
				px = -px;

			if (Math.random() < 0.5)
				py = -py;

			var t_mt = mult(mt, translation(px, py, pz));
			var coordVector = VmultM(vec4(1, 1, 1, 1), t_mt);
			var x = coordVector[0],
				y = coordVector[1],
				z = coordVector[2];

			//randomize the dir the spaceship will be traveling in
			dx *= Math.random();
			if (Math.random() < 0.5)
				dx = -dx;
			dy *= Math.random();
			if (Math.random() < 0.5)
				dy = -dy;
			dz *= Math.random();
			if (Math.random() < 0.5)
				dz = -dz;

			//randomize the axis about which the asteroid will be spinning
			var r = Math.random();
			if (r >= 0.33 && r < 0.66)
				rotAxis = 1;
			else if (r < 0.33)
				rotAxis = 2;
			
			//randomize the direction about the axis it will be spinning
			r = Math.random();
			if (r < 0.5)
				rotMag = -rotMag;

			//spawn new asteroid:
			asteroids.push({"model_transform" : t_mt, 
							"rotAxis" : rotAxis, 
							"rotMag" : rotMag, 
							"velocity" : (j == 0 ? 0.2 : v),
							"dx" : (j == 0 ? 0.001 : dx) ,
							"dy" : (j == 0 ? 0.001 : dy) ,
							"dz" : (j == 0 ? 0.001 : dz) ,
							"x" : x,
							"y" : y,
							"z" : z,
							"alien" : (Math.random() < 0.15 || j == 0 ? true : false),
							"color" : (Math.random() < 0.5 ? 1 : 2)
							})

			//signify that a new asteroid has been spawned
			
		}
	spawned = true;
	}

}

Animation.prototype.writeTitle = function(mt){
	mt = mult(mt, translation(0, 2.5, 4));
	this.m_text_line.set_string("Lost in Space");
	this.m_text_line.draw(this.graphicsState, mt, false, vec4(0,0,0,1));

}

Animation.prototype.shipExplosion = function(mt){
	mt = mult(mt, scale(1, 1, 1));
	for (var i = 0; i < nAstPieces; i++){
		var v = [Math.random()*2, Math.random()*2, Math.random()*2];
		if (Math.random() < 0.5)
			v[0] = -v[0];
		if (Math.random() < 0.5)
			v[1] = - v[1];
		if (Math.random() < 0.5)
			v[2] = - v[2];
		astPieces.push({"model_transform" : mt, 
							"velocity" : v,
							"spawnTime" : this.graphicsState.animation_time,
							"type" : (astCausesExplosion ? "ship" : "fire")
							});
	}

	this.playRandomExplosionSound();
	shipExploded = true;

}

Animation.prototype.drawAlien = function(size, mt, body, eyes, ears, mouth){
	//var forearmLen = 
	mt = mult(mt, scale(size, size, size));
	var og_mt = mt;
	//body
	mt = mult(mt, scale(0.5, 1.75, 0.5));
	mt = mult(mt, rotation(90, 1, 0, 0));
	var mtbodyCenter = mt;
	this.m_cylinder.draw(this.graphicsState, mt, body);

	//head
	mt = og_mt;
	mt = mult(mt, translation(0, 1.5, 0));
	mt = mult(mt, scale(0.75, 0.75, 0.75));
	var mtHeadCenter = mt;
	this.m_sphere.draw(this.graphicsState, mt, body);

	//eyes
	mt = mult(mt, translation(0.5, 0.5, Math.sqrt(0.5)));
	mt = mult(mt, scale(0.2, 0.2, 0.2));
	this.m_sphere.draw(this.graphicsState, mt, eyes);
	mt = mult(mt, scale(1/.2, 1/.2, 1/.2));
	mt = mult(mt, translation(-1, 0, 0));
	mt = mult(mt, scale(0.2, 0.2, 0.2));
	this.m_sphere.draw(this.graphicsState, mt, eyes);

	//mouth
	mt = mult(mt, scale(1/.2, 1/.2, 1/.2));
	mt = mult(mt, translation(0.5, -0.75, 0.35));
	mt = mult(mt, rotation(90, 0, 0, 1));	
	mt = mult(mt, scale(0.1, 0.5, 0.1));
	this.m_cube.draw(this.graphicsState, mt, mouth);

	//antennaeL
	mt = mtHeadCenter;
	mt = mult(mt, translation(0.8, 0, 0));
	mt = mult(mt, rotation(90, 0, 0, 1));
	mt = mult(mt, scale(0.2, 0.5, 0.2));
	mt = mult(mt, translation(0, -0.5, 0));
	this.m_cube.draw(this.graphicsState, mt, ears);

	//antennaeR
	mt = mtHeadCenter;
	mt = mult(mt, translation(-0.8, 0, 0));
	mt = mult(mt, rotation(90, 0, 0, 1));
	mt = mult(mt, scale(0.2, 0.5, 0.2));
	mt = mult(mt, translation(0, 0.5, 0));
	this.m_cube.draw(this.graphicsState, mt, ears);

	this.drawArms(og_mt, body);
	this.drawLegs(og_mt, body);
}

Animation.prototype.drawLegs = function(mt, body){
	//Legs
	//-----\\
	var og_mt = mt;
	//LegL
	//hip
	mt = og_mt;
	mt = mult(mt, translation(0.5, -0.8, 0));

	var rot = this.rotateLegs(0);
	mt = mult(mt, rotation(rot, 1, 0, 0));
	mt = mult(mt, scale(0.3, 0.3, 0.3));
	this.m_sphere.draw(this.graphicsState, mt, body);

	//leg
	mt = mult(mt, translation(0, -0.8, 0));
	mt = mult(mt, scale(1, 4, 1));
	mt = mult(mt, translation(0, -0.5, 0));
	this.m_cube.draw(this.graphicsState, mt, body);

	//LegR
	//hip
	mt = og_mt;
	mt = mult(mt, translation(-0.5, -0.8, 0));
	rot = this.rotateLegs(90);
	mt = mult(mt, rotation(rot, 1, 0, 0));
	mt = mult(mt, scale(0.3, 0.3, 0.3));
	this.m_sphere.draw(this.graphicsState, mt, body);

	//leg
	mt = mult(mt, translation(0, -0.8, 0));
	mt = mult(mt, scale(1, 4, 1));
	mt = mult(mt, translation(0, -0.5, 0));
	this.m_cube.draw(this.graphicsState, mt, body);

}

Animation.prototype.rotateLegs = function(offset){
	var sF = 0.3;
	var rot = 0;
	var t = (this.graphicsState.animation_time * sF) + offset;
	if (t % 180 < 90)
		rot = -45 + (t % 90);
	else
		rot = 45 - (t % 90);
	return rot;
}

Animation.prototype.drawArms = function(mt, body){
	var og_mt = mt;
	//armL
	//shoulder joint
	mt = mult(mt, translation(0.5, 0.75, 0));
	mt = mult(mt, scale(0.2, 0.2, 0.2));
	this.m_sphere.draw(this.graphicsState, mt, body);

	//bicep
	mt = mult(mt, translation(0.8, 0, 0));
	mt = mult(mt, scale(1/.2, 1/.2, 1/.2));
	mt = mult(mt, rotation(90, 0, 0, 1));
	mt = mult(mt, scale(0.2, 0.5, 0.2));
	mt = mult(mt, translation(0, -0.5, 0));
	this.m_cube.draw(this.graphicsState, mt, body);

	//elbow
	mt = mult(mt, translation(0, -0.5, 0));
	mt = mult(mt, scale(1, .2/.5, 1));
	this.m_sphere.draw(this.graphicsState, mt, body);

	//forearm
	var rot = this.armRotation();
	mt = mult(mt, rotation(rot, 0, 0, 1)); 
	mt = mult(mt, translation(0, 0.8, 0));
	mt = mult(mt, scale(1, 5, 1));
	mt = mult(mt, translation(0, 0.5, 0));
	this.m_cube.draw(this.graphicsState, mt, body);

	//armR
	//shoulder jointR
	mt = og_mt;
	mt = mult(mt, translation(-0.5, 0.75, 0));
	mt = mult(mt, scale(0.2, 0.2, 0.2));
	this.m_sphere.draw(this.graphicsState, mt, body);

	//bicepR
	mt = mult(mt, translation(-0.8, 0, 0));
	mt = mult(mt, scale(1/.2, 1/.2, 1/.2));
	mt = mult(mt, rotation(90, 0, 0, 1));
	mt = mult(mt, scale(0.2, 0.5, 0.2));
	mt = mult(mt, translation(0, 0.5, 0));
	this.m_cube.draw(this.graphicsState, mt, body);

	//elbowR
	mt = mult(mt, translation(0, 0.5, 0));
	mt = mult(mt, scale(1, .2/.5, 1));
	this.m_sphere.draw(this.graphicsState, mt, body);

	//forearmR
	var rot = this.armRotation();
	mt = mult(mt, scale(1, -1, 1));
	mt = mult(mt, rotation(rot, 0, 0, 1)); 
	mt = mult(mt, translation(0, 0.8, 0));
	mt = mult(mt, scale(1, 5, 1));
	mt = mult(mt, translation(0, 0.5, 0));
	this.m_cube.draw(this.graphicsState, mt, body);

}

Animation.prototype.armRotation = function(){
	var sF = 0.3;
	var rot = 0;
	if ((this.graphicsState.animation_time*sF) % 180 < 90)
		rot = 200 + ((this.graphicsState.animation_time*sF) % 90);
	else
		rot = 290 - ((this.graphicsState.animation_time*sF) % 90);
	return rot;
}

Animation.prototype.generateSanics = function(mt){
	if (Math.random() < 0.5)
		return //don't draw sanic
	var tX = Math.random() * 20;
	if (Math.random() < 0.5)
		tX = -tX;
	var tY = Math.random() * 20;
	if (Math.random() < 0.5)
		tY = -tY;
	var tZ = -1 * Math.random() * 300;

	var sanicMt = mult(mt, translation(tX, tY, tZ));
	var s = 1 + Math.random()*4;

	if (Math.random() < 0.1)
		sanicMt = mult(mt, scale(s, s, s));
	else
		sanicMt = mult(sanicMt, scale(s, s, s));



	sanics.push({
			"model_transform" : sanicMt,
			"spawnTime" : this.graphicsState.animation_time
	});
}

Animation.prototype.drawSanics = function(sanicMaterial){
	var len = sanics.length;
	var toRemove = [];
	for (var i = 0; i < len; i++){
		if (this.graphicsState.animation_time - sanics[i]["spawnTime"] > 4000)
			toRemove.push(i);
		else{
			this.m_cube.draw(this.graphicsState, sanics[i]["model_transform"], sanicMaterial);
		}
	}

	len = toRemove.length;
	for ( var i = 0; i < len; i++){
		sanics.splice(toRemove[i] - i);
	}
}

Animation.prototype.drawSun = function(material){
	var mt = mat4();
	mt = mult(mt, translation(500, 20, -700));
	mt = mult(mt, scale(100, 100, 100));
	this.m_sphere.draw(this.graphicsState, mt, material);
	var coordVector = VmultM(vec4(1,1,1,1), mt);
	if (this.collidedWithShip(coordVector, 250) && !gameOver){
		gameOver = true;
		timeOfExplosion = this.graphicsState.animation_time;
		console.log("game over");
		astCausesExplosion = false;
	}
}

Animation.prototype.cleanupAudio = function(){
	var toRemove = [];
	var len = audioObjects.length;
	for (var i = 0; i < len; i++){
		if (this.graphicsState.animation_time - audioObjects["timeSince"] > 4000)
			toRemove.push(i);
	}

	len = toRemove.length;
	for (var i = 0; i < len; i++){
		delete audioObjects[i]["obj"];
		audioObjects.splice(toRemove[i] - i, 1);
}
}

Animation.prototype.spawnStars = function(){
	for (var i = 0; i < nStars; i++){
		var x = Math.random()*1000;
		if (Math.random() < 0.5)
			x = -x;
		var y = 10 + Math.random()*1000;
		if (Math.random() < 0.5)
			y = -y;
		var z = 100 + Math.random()*1000;
		if (Math.random() < 0.5)
			z = -z;
		var mt = mat4();
		mt = mult(mt, translation(x, y, z));
		mt = mult(mt, scale(2, 2, 2));
		stars.push({"model_transform" : mt});
	}
}

Animation.prototype.drawStars = function(material){
	for (var i = 0; i < nStars; i++){
		var mt = stars[i]["model_transform"];
		this.m_sphere.draw(this.graphicsState, mt, material);
	}

}

Animation.prototype.updateCollisionVertices = function(model_transform, sunYellow){
	var cvMat1 = mult(model_transform, translation(3, 1, 10));
	//this.m_sphere.draw(this.graphicsState, cvMat1, sunYellow);
	var cvMat2 = mult(cvMat1, translation(-6, 0, 0));
	//this.m_sphere.draw(this.graphicsState, cvMat2, sunYellow);

	var cvMat3 = mult(model_transform, translation(9, 0.5, -9));
	//this.m_sphere.draw(this.graphicsState, cvMat3, sunYellow);
	var cvMat4 = mult(cvMat3, translation(-18, 0, 0));
	//this.m_sphere.draw(this.graphicsState, cvMat4, sunYellow);

	var cvMat5 = mult(model_transform, translation(0, 4, 0));
	//this.m_sphere.draw(this.graphicsState, cvMat5, sunYellow);
	var cvMat6 = mult(cvMat5, translation(0, 0, -9));
	//this.m_sphere.draw(this.graphicsState, cvMat6, sunYellow);
	var v4 = vec4(1,1,1,1);

	cv1 = VmultM(v4, cvMat1);
	cv2 = VmultM(v4, cvMat2);
	cv3 = VmultM(v4, cvMat3);
	cv4 = VmultM(v4, cvMat4);
	cv5 = VmultM(v4, cvMat5);
	cv6 = VmultM(v4, cvMat6);
}

Animation.prototype.cameraPanOut = function(){
	this.graphicsState.camera_transform = mult(translation(0, 0, -1 *this.animation_delta_time * 0.05), this.graphicsState.camera_transform);
}

Animation.prototype.displayGameOverText = function(){
	var mt = inverse(this.graphicsState.camera_transform);
	mt = mult(mt, translation(0, 0, 10));
	mt = mult(mt, scale(10,  10, 10));
	this.m_text_go.set_string("Dead");
	this.m_text_go.draw(this.graphicsState, mt, false, vec4(0, 0, 0, 1));
	console.log("displaying text");
}

Animation.prototype.display = function(time)
	{
		if (this.graphicsState.animation_time > 10000 && !gamePlay){ //if intro animation is over
			gamePlay = true; 
			this.graphicsState.camera_transform = mat4();
			this.graphicsState.camera_transform = (translation(0, 0, -40), this.graphicsState.camera_transform);
		}

		if (!audioInit){
			this.sanicAudio = new Audio('sounds/sanic.wav');
			this.spaceAudio = new Audio('sounds/spacecube.wav');
			this.spaceAudio.loop = true;
			this.spaceAudio.play();
			audioInit = true;
		}

		this.cleanupAudio();

		if(!time) 
			time = 0;
		this.animation_delta_time = time - prev_time;
		this.fps = 1/(this.animation_delta_time/1000);

		if(animate) 
			this.graphicsState.animation_time += this.animation_delta_time;

		prev_time = time;
		
		if(!pause && gamePlay)
			update_camera( this, this.animation_delta_time );

		this.basis_id = 0;
		
		var model_transform = mat4();
		

		
		// Materials: Declare new ones as needed in every function.
		// 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
		var purplePlastic = new Material( vec4( .9,.5,.9,1 ), .2, .5, .8, 40 ), // Omit the final (string) parameter if you want no texture
			greyPlastic = new Material( vec4( .5,.5,.5,1 ), .2, .8, .5, 20 ),
			portal = new Material( vec4( .5,.5,.5,1 ), .5, 1, 1, 40, "images/portal.png" ),
			sanicMaterial = new Material( vec4( .5,.5,.5,1 ), .5, 1, 1, 40, "images/sanic1.png" ),
			shipTexture3 = new Material( vec4( .5,.5,.5,1 ), 0.9, 0.3, 0.3, 40, "images/sstexture3.jpg"),
			shipTexture1 = new Material( vec4( .5,.5,.5,1 ), 0.7, 0.3, 0.3, 40, "images/shiptexture1.jpeg"),
			flowerStem = new Material (vec4( 225/255,165/255,26/255,1), 0.9, 0.3, 0.3, 40),
			flame = new Material (vec4(1, 0, 0, 1), 0.9, 0.3, 0.3, 40),
			beeHead = new Material (vec4(.9,.5,.9,1 ), 0.9, 0.3, 0.3, 40),
			beeButt = new Material (vec4(1,1,0,1 ), 0.9, 0.3, 0.3, 40),
			ground = new Material (vec4(71/255,224/255,69/255,1 ), 0.9, 0.3, 0.3, 40),
			asteroidBrown = new Material (vec4(160/255,82/255,45/255,1 ), 0.6, 0.9, 0.4, 40),
			genericGrey = new Material( vec4( .5,.5,.5,1 ), 0.9, 0.3, 0.3, 20 ),
			alienBody = new Material (vec4(106/255,196/255,23/255,1 ), 0.9, 0.3, 0.3, 40),
			alienEars = new Material (vec4(24/255,107/255,196/255,1 ), 0.9, 0.3, 0.3, 40),
			alienEyes = new Material (vec4(196/255,24/255,107/255,1 ), 0.9, 0.3, 0.3, 40),
			matteBlack = new Material (vec4(20/255,20/255,20/255,1 ), 0.9, 0.3, 0.3, 40),
			sunYellow = new Material (vec4(247/255,202/255,24/255,1 ), 0.9, 0.3, 0.3, 40),
			lightGrey = new Material (vec4(230/255,230/255,230/255,1 ), 0.9, 0.3, 0.3, 40);

			
		/**********************************
		Start coding here!!!!
		**********************************/

		//this.drawAlien(0.5, model_transform, alienBody, alienEyes, alienEars, matteBlack);

		//begin fps code here...
		this.drawSun(sunYellow);
		if(!starsSpawned){
			this.spawnStars();
			starsSpawned = true;
		}
		this.drawStars(sunYellow);

		this.spawnAsteroids(model_transform);
		if (this.graphicsState.animation_time > 500)
			this.drawPortal(model_transform, portal);

		if (gamePlay){
			model_transform = this.update_spaceShip(this.animation_delta_time, model_transform, shipTexture1, flame, lightGrey, lightGrey);
			//for collision detection... find the vertices...

			this.updateCollisionVertices(model_transform, sunYellow);

			//
			if (gameOver){
				var timeSinceExplosion = this.graphicsState.animation_time - timeOfExplosion;
				var t_model_transform = model_transform;
				this.cameraPanOut();
				//this.displayGameOverText();
				

				if (!shipExploded)
					this.shipExplosion(t_model_transform);

				if (timeSinceExplosion > 5000){
					this.resetGame();
				}
			}
		}
		this.update_And_Draw_Asteroids(asteroidBrown, model_transform, alienBody, alienEyes, alienEars, matteBlack);
		this.update_And_Draw_Ast_Pieces(asteroidBrown, lightGrey, flame);
		this.update_And_Draw_Floating_Aliens(alienBody, alienEyes, alienEars, matteBlack);

		//camera rotation animation at beginning
		if(!gamePlay){
			this.viewAlien();
		}

		if(warp){
			model_transform = inverse(this.graphicsState.camera_transform);
			this.generateSanics(model_transform);
			this.drawSanics(sanicMaterial);
		}


		if (fired && gamePlay){
			this.fireCannon(cannonLmt);
			this.fireCannon(cannonRmt);
			fired = false;
		}

		this.update_And_Draw_Projectiles(beeButt);


		
	}	



Animation.prototype.update_strings = function( debug_screen_strings )		// Strings this particular class contributes to the UI
{
	debug_screen_strings.string_map["time"] = "Animation Time: " + this.graphicsState.animation_time/1000 + "s";
	debug_screen_strings.string_map["fps"] = "Fps: " + this.fps;
}