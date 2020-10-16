let gui;

//initial velocity
var initailVelocity = 10,
  initailVelocityMin = 0.1,
  initailVelocityMax = 50,
  initailVelocityStep = 1;

// launch angle
var launchAngle = 45,
  launchAngleMin = 0,
  launchAnglemax = 90;

// gravity
var gravity = 9.8,
  gravityMax = 20,
  gravityMin = 1,
  gravityStep = 0.1;

// projectile height
var projectileHeight = 0,
  projectileHeightMax = 50 / 6,
  projectileHeightMin = 0,
  projectileHeightStep = 0.1;

// show velocity Components
var showVelocityComponents = true;

var pauseWhenHitTheGround = false;

function valuesSettings() {
  gui = createGui("Simulations settings");
  gui.addGlobals(
    "initailVelocity",
    "launchAngle",
    "gravity",
    "projectileHeight",
    "showVelocityComponents",
    "pauseWhenHitTheGround"
  );
}

function createFireButton() {
  const button = createButton("Fire Projectile");
  button.class("button");
  button.position(0.01 * width, 0.01 * height);
  button.mousePressed(handleFireClicked);
}

function createResetButton() {
  const button = createButton("Reset");
  button.class("button");
  button.position(0.01 * width, 0.1 * height);
  button.mousePressed(reset);
}

function ui() {
  valuesSettings();
  createFireButton();
  createResetButton();
  createPauseButton();
}

function createPauseButton() {
  const button = createButton("Pause");
  button.class("button pause");
  button.position(0.01 * width, 0.2 * height);
  button.mousePressed(handlePausePlay);
}
