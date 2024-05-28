// using ml.js
// https://github.com/mljs/ml
// some useful methods:
//  -- matrix constructor: let m = new ML.Matrix(3,3)
//  -- identity constructor: let i = ML.Matrix.eye(3,3)
//  -- matrix multiplication m.mmul(i)

let tx = 0;
let ty = 0;
let tz = 0;

let phi = 0;
let theta = 0;
let psi = 0;
let s = 300;


let vertices = [];
let lines;

function preload() {
  lines = loadStrings("data/face00.vert");
}

function mouseDragged() {

  if (keyIsPressed && keyCode == 32) {
    s+= 10*((mouseX-pmouseX) + (mouseY- pmouseY));
  } else if (keyIsPressed && keyCode == SHIFT) {
    tx += .005*(mouseX-pmouseX); 
    ty += .005*(mouseY-pmouseY); 
  } else {
    theta += .005*(mouseY-pmouseY);
    psi -= .005*(mouseX-pmouseX); 
  }
}

function keyPressed() {

  if (keyCode == UP_ARROW) {
    tz += 0.25;
  } else if (keyCode == DOWN_ARROW) {
    tz -= 0.25;
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  fill(255);
  noStroke();
  for (let i = 0; i < lines.length; i++) {
    let pieces = split(lines[i], ' ');
    if (pieces.length != 3) continue;  
    let m = new ML.Matrix(4, 1);
    m.set(0, 0, float(pieces[0]));
    m.set(1, 0, float(pieces[1]));
    m.set(2, 0, float(pieces[2]));
    m.set(3, 0, 1);
    vertices.push(m);
  }
}

function draw() {
  background(0);
  scale(s,s);
  rotateX(theta);
  rotateY(psi);
  rotateZ(phi);
  translate(tx, ty, tz);

  for (let t of vertices) {
    push();
    translate(t.get(0, 0), t.get(1, 0), t.get(2, 0));
    sphere(.005);
    pop();
  }
}
