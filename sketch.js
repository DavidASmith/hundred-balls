
// Global variables
let balls; // All balls already dropped
// let ball; 
let balls_left;
let new_ball, new_ball_diam, adding_ball; // Ball currently being dropped	
let boundaries, floor, l_wall, r_wall, ceiling; // screen boundaries
let baddies;
let inflate_sound, pop_sound, add_ball_sound, level_up_sound;

function preload() {
	inflate_sound = loadSound('assets/sounds/inflate.wav');
	pop_sound = loadSound('assets/sounds/pop.wav');
	add_ball_sound = loadSound('assets/sounds/addBall.wav');	
	level_up_sound = loadSound('assets/sounds/levelUp.wav');
}

function setup() {
	new Canvas(600, 400);

	// Setup world

	// Define boundaries for game world
	boundaries = new Group;

	floor   = new boundaries.Sprite(x = 300, y = 400, w = 600, h = 10,  collider = 's');
	l_wall  = new boundaries.Sprite(x = 0,   y = 200, w = 10,  h = 400, collider = 's');
	r_wall  = new boundaries.Sprite(x = 600, y = 200, w = 10,  h = 400, collider = 's');
	ceiling = new boundaries.Sprite(x = 300, y = 0,   w = 600,  h = 10, collider = 's');

	// Initialise balls
	balls = new Group();
	new_ball_diam = 1;
	balls_left = 100;

	// Initialise baddies
	baddies = new Group();
	baddy = new baddies.Sprite(300, 200, 10, 10, collider = 'd');

}

function draw() {

	clear();
	background('gray');
	
	// If we're currently adding a ball
	if(adding_ball) {
		// Ball follows mouse
		new_ball.x = mouseX;
		new_ball.y = mouseY;
		// Ball size increases
		new_ball.w = new_ball.w + 2
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
		}
	}

	// The baddies go for a random walk
	baddy.bearing = baddy.bearing + random(-90, 90);
	baddy.applyForce(random(0, 1));

	// Apply gravity to balls
	balls.applyForceScaled({ x: 0, y: 10});

}

function mouseReleased() {
	if(adding_ball) {
		addBall();
	}
}


function mousePressed() {
	adding_ball = true;
	new_ball = new Sprite(mouseX, mouseY, new_ball_diam, collider = 's');
	inflate_sound.play();
}

function addBall() {
	ball = new balls.Sprite(new_ball.x, new_ball.y, w = new_ball.w);
	new_ball.remove();
	adding_ball = false;
	inflate_sound.stop();
	add_ball_sound.play();
}S