
// Global variables
let balls; // All balls already dropped
let balls_left;
let new_ball, new_ball_diam, adding_ball; // Ball currently being dropped	
let boundaries, floor, l_wall, r_wall, ceiling; // screen boundaries
let baddies;
let inflate_sound, pop_sound, add_ball_sound, level_up_sound;
let level;
let screen_area;

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
	//screen_area = canvas.w * canvas.h;
	baddie_colour = color(204, 51, 63);
	ball_colour = color(0, 160, 176);
	background_colour = color(106, 74, 60);
	text_colour = color(237, 201, 81);
	progress_colour = color(0, 160, 176);
	adding_ball_colour = color(204, 51, 63);
	target_colour = color(237, 201, 81);
	progress_background_olour = color(235, 104, 65);

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
	balls_left = 100;

	// Initialise baddies
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
	baddy.bearing = baddy.bearing + random(-90, 90);
	baddy.applyForce(random(0, 1));

	// Apply gravity to balls
	balls.applyForceScaled({ x: 0, y: 10});

	balls.draw();
	displayLives();
	displayLevel();


}

function mouseReleased() {
	if(adding_ball) {
		addBall();
	}
}


function mousePressed() {
	adding_ball = true;
	new_ball = new Sprite(mouseX, mouseY, new_ball_diam, collider = 's');
	new_ball.color = ball_colour;
	inflate_sound.play();
}

function addBall() {
	ball = new balls.Sprite(new_ball.x, new_ball.y, w = new_ball.w);
	new_ball.remove();
	adding_ball = false;
	inflate_sound.stop();
	add_ball_sound.play();
	balls_left --;
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