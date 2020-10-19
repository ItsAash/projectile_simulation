class Ball {
  constructor(x, y, r, m) {
    this.position = createVector(x, y);
    this.radius = r;
    this.mass = m;

    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);

    this.prevPositions = [];

    this.projectileHeight = projectileHeight;

    this.maxHeightItReached = this.projectileHeight;
  }

  applyForce(f) {
    const force = p5.Vector.div(f, this.mass);
    this.acceleration.add(force);
  }

  update() {
    if (this.position.y > this.maxHeightItReached) {
      this.maxHeightItReached = this.position.y;
    }

    this.projectileHeight = projectileHeight;
    this.prevPositions.push(this.position.copy());
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.set(0, 0);
  }

  checkGroundHit(y) {
    return ball.position.y + ball.radius < y && firing && !paused;
  }

  render() {
    push();
    fill("#ed225d");
    noStroke();
    ellipse(
      this.position.x,
      this.projectileHeight * 60 + this.position.y,
      15,
      15
    );
    pop();
    if (firing && showVelocityComponents) {
      this.renderComponentVectors();
    }
  }

  renderComponentVectors() {
    const velocityVector = this.velocity.copy();
    velocityVector.mult(10);

    const xVelocityMag = velocityVector.mag() * cos(velocityVector.heading());
    const yVelocityMag = velocityVector.mag() * sin(velocityVector.heading());

    const xComponentVector = p5.Vector.fromAngle(0, xVelocityMag);
    const yComponentVector = p5.Vector.fromAngle(PI / 2, yVelocityMag);

    const positionVector = this.position.copy();
    positionVector.add(0, projectileHeight * 60);
    push();

    // components arrow render
    vectorLine(positionVector, xComponentVector, "white", {
      arrowSize: 5,
      strokeWeigh: 1,
    });
    vectorLine(positionVector, yComponentVector, "white", {
      arrowSize: 5,
      strokeWeigh: 1,
    });
    vectorLine(positionVector, velocityVector, "white", {
      arrowSize: 5,
      strokeWeigh: 1,
    });
    pop();
    push();
    // components velocity render
    translate(this.position.x, this.position.y);
    fill(255);
    scale(1, -1);
    // xvelocity
    rotate(xComponentVector.heading());
    text(
      `${(xVelocityMag / 10).toFixed(2)}`,
      10,
      -10 - this.projectileHeight * 60
    );
    pop();
    // y velocity
    push();
    const yComponentHead = p5.Vector.add(this.position, yComponentVector).add(
      0,
      this.projectileHeight * 60
    );
    translate(yComponentHead.x, yComponentHead.y);
    fill(255);
    scale(1, -1);
    textAlign(CENTER, CENTER);
    rotate(yComponentVector.heading());
    text(` ${(yVelocityMag / 10).toFixed(2)}`, 10, -10);
    pop();

    // resultant velocity
    push();
    fill(255);
    const velocityComponentHead = p5.Vector.add(
      this.position,
      velocityVector
    ).add(0, this.projectileHeight * 60);
    translate(velocityComponentHead.x, velocityComponentHead.y);
    rotate(velocityVector.heading());
    scale(1, -1);
    text(`${(velocityVector.mag() / 10).toFixed(2)}`, -50, -10);
    pop();
  }

  //

  renderTraces() {
    push();
    noFill();
    stroke(255);
    beginShape();
    for (let i = 0; i < this.prevPositions.length; i++) {
      const p1 = this.prevPositions[i];
      vertex(p1.x, p1.y + this.projectileHeight * 60);
    }
    endShape();
    pop();
  }

  init() {
    this.update();
    this.render();
    this.renderTraces();
  }
}
