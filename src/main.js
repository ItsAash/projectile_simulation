let ball;
let firing = false;
let paused = false;

let timePassed = 0;

let prevBall;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ui();

  ball = new Ball(0, 0, 10, 1);
  prevBall = ball;

  frameRate(60);
}

function draw() {
  background(0);
  translate(0.2 * width, 0.8 * height);
  scale(1, -1);
  if (!firing) {
    drawVelocityArrow();
  }
  drawCoordinateGrid();
  ball.init();

  if (firing && !paused) {
    const gravitionalForce = createVector(0, -gravity / 60);
    gravitionalForce.mult(ball.mass);
    ball.applyForce(gravitionalForce);
  }
  if (!paused && firing) {
    timePassed += deltaTime;
  } else {
    deltaTime = 0;
  }

  if (ball.checkGroundHit(-projectileHeight * 60) && pauseWhenHitTheGround) {
    pauseSimualation();
  }

  // writeMaths();

  push();
  textSize(20);
  fill(255);
  scale(1, -1);
  text(
    `Time passed: ${(timePassed / 1000).toFixed(2)} seconds`,
    0.1 * width,
    0.1 * height
  );
  pop();
}
function drawCoordinateGrid() {
  push();
  stroke(255);
  strokeWeight(2);
  vectorLine(createVector(0, -0.2 * height), createVector(0, height), "white", {
    arrowSize: 5,
    strokeWeigh: 1,
  });
  vectorLine(createVector(-0.2 * width, 0), createVector(width, 0), "white", {
    arrowSize: 5,
    strokeWeigh: 1,
  });
  pop();
}

function vectorLine(base, vec, myColor, { arrowSize, strokeWeigh }) {
  push();
  stroke(myColor);
  strokeWeight(strokeWeigh);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function drawVelocityArrow() {
  const velocityVectorLength = initailVelocity * 10;
  const arrowVector = p5.Vector.fromAngle(
    radians(launchAngle),
    velocityVectorLength
  );
  vectorLine(createVector(0, projectileHeight * 60), arrowVector, "white", {
    arrowSize: 6,
    strokeWeigh: 3,
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function handleFireClicked(e) {
  if (firing) return;
  resolveFiring(initailVelocity, launchAngle, true);
  firing = true;
}

function resolveFiring(vel, angle, bool) {
  if (bool) frameCount = 0;
  const velocityVector = p5.Vector.fromAngle(radians(angle));
  velocityVector.normalize();
  velocityVector.mult(vel);
  ball.acceleration = createVector();
  ball.velocity = velocityVector;
}

function reset() {
  firing = false;
  paused = true;
  handlePausePlay();
  timePassed = 0;
  ball = new Ball(0, 0, 10, 1);
}

function handlePausePlay() {
  paused = !paused;
  if (paused) {
    noLoop();
    prevBall = ball;
    deltaTime = 0;
    document.querySelector(".pause").innerText = "Resume";
    ball.acceleration = createVector();
  } else {
    deltaTime = 0;
    document.querySelector(".pause").innerText = "Pause";
    ball = prevBall;
    loop();
  }
}

function writeMaths() {
  const u = initailVelocity;
  const angle = radians(launchAngle);

  const R = ((Math.pow(u, 2) * sin(2 * angle)) / gravity) * 60;
  const H = ((Math.pow(u, 2) * Math.pow(sin(angle), 2)) / (2 * gravity)) * 60;
  push();
  stroke(255);
  strokeWeight(2);
  line(0, 0, R, 0);
  line(R / 2, 0, R / 2, H);

  //max height
  line(0, ball.maxHeightItReached, ball.position.x, ball.maxHeightItReached);
  console.table({ actualHeight: ball.maxHeightItReached, calculation: H });
  pop();
}

function velocityOfInstances(t) {
  const g = gravity;
  const v = Math.sqrt(
    initailVelocity ** 2 +
      g ** 2 +
      t ** 2 -
      2 * initailVelocity * g * t * sin(radians(launchAngle))
  );
  const velDirection = atan(
    (initailVelocity * sin(radians(launchAngle)) - g * t) /
      (initailVelocity * cos(radians(launchAngle)))
  );
  console.table({
    gravity: g,
    velocityMag: v,
    direction: velDirection,
    initailVelocity,
    t,
    launchAngle,
  });

  const velocityVector = p5.Vector.fromAngle(velDirection);
  velocityVector.setMag(-v);
  return velocityVector;
}

function pauseSimualation() {
  handlePausePlay();
}
