//Gravitas Epistola | the weightiness of a letter
// Declare an array to store letter objects
let letters = [];

// Declare constants for the falling speed, font size, and other properties
const fallingSpeed = 2;
const fontSize = 30;
const mouseForceMultiplier = 2;
const bounceFactor = 0.8;
const floorFriction = 0.9;

// Set up the canvas, background color, text size, and angle mode
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  textSize(fontSize);
  angleMode(DEGREES);
}

// Main draw loop
function draw() {
  // Refresh the background with a low opacity to create a fading trail effect
  background(255, 5);

  // Loop through each letter in the letters array
  for (let i = 0; i < letters.length; i++) {
    let letter = letters[i];

    // Update the letter's position based on its velocity
    letter.y += letter.velocity.y;
    letter.x += letter.velocity.x;

    // Apply the falling speed to the letter's vertical velocity
    letter.velocity.y += fallingSpeed;

    // Calculate the distance between the current mouse position and the letter
    let d = dist(mouseX, mouseY, letter.x, letter.y);
    // Apply force to the letter if it's within a certain distance from the mouse
    if (d < fontSize * 2) {
      // Calculate the force based on the distance between the mouse and the letter
      let force = ((fontSize * 4 - d) ** 2) * mouseForceMultiplier / 1000;
      // Calculate the angle between the mouse and the letter
      let angle = atan2(letter.y - mouseY, letter.x - mouseX);
      // Update the letter's velocity based on the calculated force and angle
      letter.velocity.x += cos(angle) * force;
      letter.velocity.y += sin(angle) * force;
    }

    // Detect collision with the bottom of the window or other letters
    if (letter.y >= height - fontSize / 2 || isCollidingWithLetters(letter)) {
      // Constrain the letter's position within the canvas bounds
      letter.y = min(letter.y, height - fontSize / 2);
      // Reverse the vertical velocity and apply the bounce factor
      letter.velocity.y *= -bounceFactor;

      // Add a random angle to make the bounce more chaotic
      let randomAngle = random(-5, 5);
      let angle = atan2(letter.velocity.y, letter.velocity.x) + randomAngle;
      let speed = sqrt(letter.velocity.x ** 2 + letter.velocity.y ** 2);
      letter.velocity.x = cos(angle) * speed * floorFriction;
      letter.velocity.y = sin(angle) * speed;
    }

    // Detect collision with left and right edges
    if (letter.x <= fontSize / 2 || letter.x >= width - fontSize / 2) {
      // Constrain the letter's position within the canvas bounds
      letter.x = constrain(letter.x, fontSize / 2, width - fontSize / 2);
      // Reverse the horizontal velocity and apply the bounce factor
      letter.velocity.x *= -bounceFactor;
    }

    // Rotate the letter and draw it on the canvas
    push();
    translate(letter.x, letter.y);
    rotate(letter.rotation);
    fill(letter.color);
    text(letter.char, 0, 0);
    pop();

    // Create a new letter if the existing letter reaches the top of the window and its velocity is negative
    if (letter.y <= 0 && letter.velocity.y < 0 && !letter.createdNewLetter) {
      // Create a new letter object with random properties and add it to the letters array
      let newLetter = {
        char: letter.char,
        x: random(width),
        y: -fontSize,
        velocity: createVector(0, 0),
        rotation: random(360),
        color: color(random(0, 150)),
        createdNewLetter: false,
      };
      letters.push(newLetter);
      // Mark the current letter as having created a new letter to avoid infinite loops
      letter.createdNewLetter = true;
    }
  }
}

// Function to check if a letter is colliding with any other letters in the array
function isCollidingWithLetters(letter) {
  for (let i = 0; i < letters.length; i++) {
    let other = letters[i];
    // Check if the letter is colliding with another letter by comparing their positions and sizes
    if (letter !== other && abs(letter.y - other.y) < fontSize && abs(letter.x - other.x) < fontSize) {
      return true;
    }
  }
  return false;
}

// Function to handle key input
function keyTyped() {
  // Check if the spacebar is pressed
  if (key === ' ') {
    // Remove the last letter from the array
    if (letters.length > 0) {
      letters.pop();
    }
  } else {
    // Create a new letter object with random properties and add it to the letters array
    let newLetter = {
      char: key,
      x: random(width),
      y: -fontSize,
      velocity: createVector(0, 0),
      rotation: random(360),
      color: color(random(0, 50)),
      createdNewLetter: false,
    };
    letters.push(newLetter);
  }
}

// Function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
