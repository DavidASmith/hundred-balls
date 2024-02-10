let balls; // All balls already dropped
let ball; 
let new_ball, new_ball_diam, adding_ball; // Ball currently being dropped	
let boundaries, floor, l_wall, r_wall, ceiling // screen boundaries

function setup() {
	new Canvas(600, 400);

	world.gravity.y = 10;

	balls = new Group();

	floor = new Sprite(x = 300, y = 400, w = 600, h = 10, collider = 's');

	new_ball_diam = 10;

}

function draw() {
 
	if(adding_ball) {
		new_ball.x = mouseX;
		new_ball.y = mouseY;
		new_ball.w = new_ball.w + 2
	}

	background('gray');
	clear();
}

function mouseReleased() {
	ball = new balls.Sprite(new_ball.x, new_ball.y, w = new_ball.w);
	new_ball.remove();
}


function mousePressed() {
	adding_ball = true;
	new_ball = new Sprite(mouseX, mouseY, new_ball_diam);
}

