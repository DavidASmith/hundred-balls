
// Global variables
let balls; // All balls already dropped
let balls_left; // How many balls we have left to play with
let new_ball, new_ball_diam, adding_ball; // Ball currently being dropped	
let floor; // screen boundaries
let baddies, num_baddies, baddie_force;
// Sounds
let inflate_sound, pop_sound, add_ball_sound, level_up_sound;
// Game state 
let level, screen_area, balls_area, target, game_over;
// Colours
let baddie_colour, ball_colour, background_colour, text_colour, progress_colour, adding_ball_colour, target_colour, progress_background_colour;

function preload() {
	inflate_sound = loadSound('assets/sounds/inflate.wav');
	pop_sound = loadSound('assets/sounds/pop.wav');
	add_ball_sound = loadSound('assets/sounds/addBall.wav');	
	level_up_sound = loadSound('assets/sounds/levelUp.wav');
}

function setup() {
	new Canvas(600, 400);

	// Setup world
	screen_area = width * height;

	// Colors
	// https://coolors.co/palette/780000-c1121f-fdf0d5-003049-669bbc
	baddie_colour = color(193, 18, 31); 
	ball_colour = color(102, 155, 188); 
	background_colour = color(0, 48, 73); 
	text_colour = color(253, 240, 213); 
	progress_colour = color(102, 155, 188); 
	adding_ball_colour = color(102, 155, 188); 
	target_colour = color(120, 0, 0); 
	progress_background_colour = color(0, 48, 73); 

	// Define boundaries for game world
	floor = new Sprite([[0, 0], [0, 400], [600, 400], [600, 0], [1, 0]]);
	floor.color = background_colour;
	floor.collider = 'static';

	// Initialise balls
	balls = new Group();
	balls.color = ball_colour;
	new_ball_diam = 1;

	// Initialise baddies
	baddies = new Group();
	baddies.color = baddie_colour;

	// Start new game
	setupNewGame();
}

function draw() {
	
	clear();
	background(background_colour);
	
	// If we're currently adding a ball
	if(adding_ball) {
		// Ball follows mouse
		new_ball.x = mouseX;
		new_ball.y = mouseY;
		// Ball size increases
		new_ball.w = new_ball.w + 2
		new_ball.draw();
		// Add the ball if it touches any other balls or boundaries
		if(new_ball.collides(balls)) {
			addBall();
		}
		if((new_ball.x + (new_ball.w / 2) > width) || 
		   (new_ball.x - (new_ball.w / 2) < 0) ||
		   (new_ball.y + (new_ball.w / 2) > height) ||
		   (new_ball.y - (new_ball.w / 2) < 0)) {
			addBall();
		}
		// Stop adding the ball if it touches a baddy
		if(new_ball.collides(baddies)) {
			new_ball.remove();
			adding_ball = false;
			inflate_sound.stop();
			pop_sound.play();
			balls_left --;
			if(balls_left < 1) {
				game_over = true;
			}
		}
	}

	// The baddies go for a random walk
	for (my_baddy of baddies) {
		my_baddy.bearing = my_baddy.bearing + random(-90, 90);
	}
	
	baddies.applyForce(baddie_force);

	// Apply gravity to balls
	balls.applyForceScaled({ x: 0, y: 10});

	balls.draw();
	displayLives();
	displayLevel();
	displayProgressBar();

	if(game_over) {
		displayGameOver();
	}


}

function mouseReleased() {
	if(adding_ball) {
		addBall();
	}
}

function setupNewGame() {

	// Setup balls
	balls.remove();
	balls_left = 100;
	game_over = false;
	balls_area = 0;
	target = 0.5;

	// Setup baddies
	baddies.remove();
	baddie_force = 0.1;
	addBaddy();

	// Start at the beginning
	level = 1;

}

function addBaddy() {
	baddy = new baddies.Sprite(random(10, width - 10), random(10, height - 10), 8, 'pentagon');
}

function mousePressed() {
	if(!game_over) {
		adding_ball = true;
		new_ball = new Sprite(mouseX, mouseY, w = new_ball_diam, collider = 's');
		new_ball.color = ball_colour;
		inflate_sound.play();
	} else {
		setupNewGame();
	}
}

function addBall() {
	ball = new balls.Sprite(new_ball.x, new_ball.y, w = new_ball.w);
	balls_area += pow(new_ball.w / 2, 2) * PI;
	new_ball.remove();
	adding_ball = false;
	inflate_sound.stop();
	add_ball_sound.play();
	balls_left --;
	if(balls_area / screen_area > target) {
		levelUp();
	}
	if(balls_left < 1) {
		game_over = true;
	}
}


function displayLives() {
	fill(text_colour);
	textSize(32);
	textAlign(RIGHT);
	text(balls_left, width - 20, height - 20);
	textSize(12);
	text("Balls", width - 20, height - 50);
  }

function displayLevel() {
	fill(text_colour);
	textSize(32);
	textAlign(LEFT);
	text(level, 20, height - 20);
	textSize(12);
	text("Level", 20, height - 50);
  }


function displayProgressBar() {
	let indentation = 20;
	let girth = 20;
	stroke(0);
	rectMode(CORNER);
	fill(progress_background_colour);
	rect(indentation, indentation, width - 2 * indentation, girth);
	fill(target_colour);
	rect(indentation, indentation, (width - 2 * indentation) * target, girth);
	fill(progress_colour);
	rect(indentation, indentation, (width - 2 * indentation) * (balls_area/screen_area), girth);
	if (adding_ball) {
	  fill(adding_ball_colour);
	  rect(indentation + (width - 2 * indentation) * (balls_area/screen_area), indentation, (width - 2 * indentation) * ((PI * pow(new_ball.w / 2, 2))/screen_area), girth);
	}
	//fill(text_colour);
	//textSize(10);
	//textAlign(CENTER);
	//text("Target", indentation + (width - 2 * indentation) * target, 18);
  }

function levelUp() {
	level ++;
	balls.remove();
	balls_area = 0;
	if (level % 5 == 0) {
		addBaddy();
	}
	target = min(0.75, target + 0.005);
	baddie_force = baddie_force * 1.05;
	level_up_sound.play();

}

function displayGameOver() {
	//background(background_colour);
	fill(text_colour);
	textSize(32);
	textAlign(CENTER);
	text("Game over - all balls gone!", width/2, height/2 - 40);
	text("You reached level " + level + ".", width/2, height/2);
	textSize(32);
	text("Click to try again.", width/2, height/2 + 40);

  }