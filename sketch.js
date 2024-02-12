
// Global variables
let balls; // All balls already dropped
let balls_left; // How many balls we have left to play with
let new_ball, new_ball_diam, adding_ball; // Ball currently being dropped	
let boundaries, floor, l_wall, r_wall, ceiling; // screen boundaries
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

	// Intitialise game state
	screen_area = width * height;
	balls_left = 100;
	game_over - false;
	balls_area = 0;
	target = 0.5;


	// Colors
	baddie_colour = color(204, 51, 63);
	ball_colour = color(0, 160, 176);
	background_colour = color(106, 74, 60);
	text_colour = color(237, 201, 81);
	progress_colour = color(0, 160, 176);
	adding_ball_colour = color(204, 51, 63);
	target_colour = color(237, 201, 81);
	progress_background_colour = color(235, 104, 65);

	// Define boundaries for game world
	boundaries = new Group;

	floor   = new boundaries.Sprite(x = 300, y = 400, w = 600, h = 10,  collider = 's');
	l_wall  = new boundaries.Sprite(x = 0,   y = 200, w = 10,  h = 400, collider = 's');
	r_wall  = new boundaries.Sprite(x = 600, y = 200, w = 10,  h = 400, collider = 's');
	ceiling = new boundaries.Sprite(x = 300, y = 0,   w = 600,  h = 10, collider = 's');

	// Initialise balls
	balls = new Group();
	balls.color = ball_colour;
	new_ball_diam = 1;


	// Initialise baddies
	num_baddies = 1;
	baddie_force = 0.1;
	baddies = new Group();
	baddies.color = baddie_colour;
	baddy = new baddies.Sprite(300, 200, 10, 10, collider = 'd');

	level = 1;

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
		if((new_ball.x + (new_ball.w / 2) > 600) || 
		   (new_ball.x - (new_ball.w / 2) < 0) ||
		   (new_ball.y + (new_ball.w / 2) > 400) ||
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


}

function mouseReleased() {
	if(adding_ball) {
		addBall();
	}
}


function mousePressed() {
	adding_ball = true;
	new_ball = new Sprite(mouseX, mouseY, w = new_ball_diam, collider = 's');
	new_ball.color = ball_colour;
	inflate_sound.play();
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
}


function displayLives() {
	fill(text_colour);
	textSize(32);
	textAlign(RIGHT);
	text(balls_left, width - 20, height - 20);
	textSize(12);
	text("Balls Left", width - 20, height - 50);
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
	fill(text_colour);
	textSize(10);
	textAlign(CENTER);
	text("Target", indentation + (width - 2 * indentation) * target, 18);
  }

function levelUp() {
	level ++;
	balls.remove();
	balls_area = 0;
	if (level % 5 == 0) {
		baddy = new baddies.Sprite(300, 200, 10, 10, collider = 'd');
	}
	target = min(0.75, target + 0.005);
	baddie_force = baddie_force * 1.02;
	level_up_sound.play();

}