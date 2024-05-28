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
let cx = 0;
let cy = 0;

let ctr = 0;

let persp = new ML.Matrix([
  [1,0,0,0],
  [0,1,0,0],
  [0,0,1,0]
]);
      
let ortho = new ML.Matrix([
  [1,0,0,0],
  [0,1,0,0],
  [0,0,0,1]
]);

let proj = persp;

let vertices = [];
let lines;

function preload() {
  lines = loadStrings("data/face01.vert");
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
  else if (keyCode == LEFT_ARROW){
    proj = persp;
  }
  else if (keyCode == RIGHT_ARROW){
    proj = ortho;
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  fill(255);
  noStroke();
  for (let i = 0; i < lines.length; i++) {
    let pieces = split(lines[i], ' '); //break into x,y,z
    print("pieces: " + pieces);
    if (pieces.length != 3) continue;  
      let sourcePoint = new ML.Matrix(4,1);
      sourcePoint.set(0, 0, float(pieces[0])); 
      sourcePoint.set(1, 0, float(pieces[1]));
      sourcePoint.set(2, 0, float(pieces[2]));
      sourcePoint.set(3, 0, 1); //we made a cool vector with (x,y,z,1)
      vertices.push(sourcePoint); //thx vertices, for holding all our points
  }
}

function draw() {
  background(0);
  //scale(s,s); 
  //rotateX(theta);
  //rotateY(psi);
  //rotateZ(phi);
  //translate(tx, ty, tz);

  //f is focal length cx and cy should just be 0 for now lmao he seems so upset

  //don't think we use this; this was before we realized R|T is different in 2d and 3d
  let rt2d = new ML.Matrix([
    [Math.cos(theta), (-1)*Math.sin(theta), tx],
    [Math.sin(theta), Math.cos(theta), ty],
    [0, 0, 1]
  ]);
  
  let k = new ML.Matrix([
    [s,0,cx],
    [0,s,cy],
    [0,0,1]
  ]);

  let rz = new ML.Matrix([
    [Math.cos(phi), (-1)*Math.sin(phi), 0, 0],
    [Math.sin(phi), Math.cos(phi), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]);

  let ry = new ML.Matrix([
    [Math.cos(psi), 0, Math.sin(psi), 0],
    [0, 1, 0, 0],
    [(-1)*Math.sin(psi), 0, Math.cos(psi), 0],
    [0, 0, 0, 1]
  ]);

  let rx = new ML.Matrix([
    [1, 0, 0, 0],
    [0, Math.cos(theta), (-1)*Math.sin(theta), 0],
    [0, Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 0, 1]
  ]);

  let r = rz.mmul(ry.mmul(rx)); //im so sad

  
  let rt = r;
  rt.set(0,3, tx);
  rt.set(1,3, ty);
  rt.set(2,3, tz);
  //rt.set(3,3, 1);



  for (let t of vertices) {
    let kmult = k.mmul(proj);
    let rtmult = kmult.mmul(rt);
    let finalmult = rtmult.mmul(t); //kinda pog of us
    //theoretically finalmult is a 1x3 matrix [x,y,w] (but vertical, don't call me out on not wanting 3 comments)
    let w = finalmult.get(2,0);
    let x = finalmult.get(0,0)/w;
    let y = finalmult.get(1,0)/w;
    //what if we print
    if(ctr <= 8){
      print("Input coords: " + t);
      print("Finalmult: " + finalmult);
      print("w: " + w);
      print("x, y: " + x + ", " + y);
      ctr++;
    }

    circle(x,y,5);

  }
}
