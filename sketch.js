let balls; // All balls already dropped
let ball; 
let new_ball, new_ball_diam, adding_ball; // Ball currently being dropped	
let boundaries, floor, l_wall, r_wall, ceiling; // screen boundaries
let baddies;

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

	// Initialise baddies
	baddies = new Group();
	baddy = new baddies.Sprite(300, 200, 10, 10, collider = 'd');

}

function draw() {

	clear();
	background('gray');
	
	if(adding_ball) {
		new_ball.x = mouseX;
		new_ball.y = mouseY;
		new_ball.w = new_ball.w + 2
	}

	baddy.bearing = baddy.bearing + random(-90, 90);
	baddy.applyForce(random(0, 1));

	balls.applyForceScaled({ x: 0, y: 10});
	//balls.applyForce({ x: 0, y: 10});


}

function mouseReleased() {
	ball = new balls.Sprite(new_ball.x, new_ball.y, w = new_ball.w);
	new_ball.remove();
	adding_ball = false;
}


function mousePressed() {
	adding_ball = true;
	new_ball = new Sprite(mouseX, mouseY, new_ball_diam, collider = 's');
}

