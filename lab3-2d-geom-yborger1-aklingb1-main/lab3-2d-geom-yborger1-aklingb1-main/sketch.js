'use strict';

let fish_csv;
let fish = []

function preload() {
  fish_csv = loadTable('fish.csv', 'csv', 'header');
}

function setup() {
  createCanvas(800, 800);
  for (let line of fish_csv.getArray()) {
    let curve = [];
    for (let i = 0; i < line.length; i += 2) {
      curve.push(new p5.Vector(line[i], line[i + 1]));
    }
    fish.push(curve);
  }
}

function vscale(v, sx, sy) {
  // TODO: should return a new vector
  // use your transform() to scale by (sx,sy)
  let matrx = [[sx, 0, 0], [0, sy, 0], [0,0,1]];
  let newv = transform(v, matrx);
  return newv;
}

function applyT(curves, t) {
  let newImg = [];
  for (let line of curves) {
    let newline = line.map(t);
    newImg.push(newline);
  }
  return newImg;
}

function transform(v, matrix) {
  let newX = 0;
  let newY = 0;
  let newZ = 0;
  for (let y = 0; y < matrix.length; y++){
    let sum = 0;
    for(let x = 0; x < matrix[0].length; x++){
      if(x==0){
        sum += (matrix[y][x])*v.x;
      }
      else if(x==1){
        sum += (matrix[y][x])*v.y;
      }
      else{
        sum += (matrix[y][x])*v.z;
      }
    }
    if(y==0){
      newX = sum;
    }
    else if(y==1){
      newY = sum;
    }
    else{
      newZ = sum;
    }
  }
  return new p5.Vector(newX, newY, newZ);
}

function shrink(curves) {
  // shrink the curve 20% in the X and 20% in the Y
  return applyT(curves, (v) => vscale(v, 0.2, 0.2));
}

function shift(curves) {
  // move the curve over to the bottom right
  return applyT(curves, (v) => vtranslate(v, 0.2, 0.2));
}

function vtranslate(v, tx, ty) {
  let matrx = [[1, 0, tx], [0, 1, ty], [0,0,1]];
  let coolv = new p5.Vector(v.x,v.y,1);
  let newv = transform(coolv, matrx);
  return newv;
}

function vrotate(v, angle) {
  let matrx = [[Math.cos(angle), (-1*Math.sin(angle)), 0], [Math.sin(angle), Math.cos(angle), 0], [0,0,1]];
  let coolv = new p5.Vector(v.x,v.y,1);
  let newv = transform(coolv,matrx);
  return newv;
}

function flip(curves) {
  // TODO
  // scale by -1 in the horizontal and then shift right by 1
  let ncurve = applyT(curves, (v) => vscale(v, -1, 1));
  return applyT(ncurve, (v) => vtranslate(v, 1, 0));
  //return ncurve
}

function rot(curves) {
  // TODO
  // rotate by -90 then shift down by 1
  let ncurves = applyT(curves, (v) => vrotate(v,(-Math.PI / 2)));
  //return ncurves;
  return applyT(ncurves, (v) => vtranslate(v, 0, 1));
}

function rot45(curves) {
  // TODO
  // rotate by -45, then scale by 1 / sqrt(2) in both directions

  let ncurves = applyT(curves, (v) => vrotate(v,(-Math.PI / 4)));
  let thenum = 1 / Math.sqrt(2);
  let scaledCurves = applyT(ncurves, (v) => vscale(v, thenum, thenum));

  return scaledCurves;
}

function over(first, second) {
  // return a new curve as the union of two curves (first & second)
  let newImg = first.concat(second);
  return newImg;
  //keith I'm pretty sure that this is not an image? uhh...ANYWAY
}


function beside(leftc, rightc, l = 0.5, r = 0.5) {
  // TODO
  // stack two curves (`leftc` & `rightc`) next to each other
  // the left curve is scaled by `l` in the horizontal direction
  // the right curve is scaled by `r` and shifted by `l`

  // starter code here is just a hint, feel free to erase

  /*let nl = [];
  let nr = [];
  return nl.concat(nr);*/
  let lcurve = applyT(leftc, (v) => vscale(v, l, 1)); //scaled in terms of t
  let rcurve = applyT(rightc, (v) => vscale(v, r, 1));
  let lshift = applyT(rcurve, (v) => vtranslate(v, l, 0));
  let combo = over(lcurve, lshift);
  return combo;


}

function above(topc, bottomc, t = 0.5, b = 0.5) {
  // TODO
  // stack two curves (`topc` & `bottomc`) on top of each other
  // the top curve is scaled by `t` in the vertical direction
  // the bottom curve is scaled by `b` and shifted by `t`

  // starter code here is just a hint, feel free to erase
/*
  let newImg = [];
  for (let line of topc) {
    let newline = []
    for (let v of line) {
      newline.push(v); // transform v
    }
    newImg.push(newline);
  }
  for (let line of bottomc) {
    let newline = line.map((v) => v);  // trasnform v
    newImg.push(newline);
  return newImg;

  }
  */

  //so we need to scale the two curves
  //then call over to combo
  //GAH
  let tcurve = applyT(topc, (v) => vscale(v, 1, t)); //scaled in terms of t
  let bcurve = applyT(bottomc, (v) => vscale(v, 1, b));
  let tshift = applyT(bcurve, (v) => vtranslate(v, 0, t));
  let combo = over(tcurve, tshift);
  return combo;

}

function drawCurve(curve) {
  // give a list of bezier curves, draw them
  // sc: controls how big by default the whole screen
  // TODO: get vscale to work otw you won't see the TINY curves
  noFill();
  stroke(24);
  let sc = width;
  for (let line of curve) {
    let newline = line.map((v) => vscale(v, sc, sc));
    const [v1, v2, v3, v4] = newline;
    bezier(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, v4.x, v4.y);
  }

}

function quartet(p, q, r, s) {
  return above(beside(p, q), beside(r, s));
}

function nonet(p, q, r, s, t, u, v, w, x) {
  return above(
    beside(p, beside(q, r), 1 / 3, 2 / 3),
    above(
      beside(s, beside(t, u), 1 / 3, 2 / 3),
      beside(v, beside(w, x), 1 / 3, 2 / 3),
    ),
    1 / 3, 2 / 3);
}


function side(n, t, u) {
  if (n == 0) return [];
  else return quartet(side(n - 1, t, u), side(n - 1, t, u), rot(t), t);
}

function corner(n, t, u) {
  if (n == 0) return [];
  else return quartet(corner(n - 1, t, u), side(n - 1, t, u), rot(side(n - 1, t, u)), u);
}

function squarelimit(n, t, u) {
  return nonet(
    corner(n, t, u),
    side(n, t, u),
    rot(rot(rot(corner(n, t, u)))),
    rot(side(n, t, u)),
    u,
    rot(rot(rot(side(n, t, u)))),
    rot(corner(n, t, u)),
    rot(rot(side(n, t, u))),
    rot(rot(corner(n, t, u)))
  );
}

function draw() {
  background(240);
  let smallfish = flip(rot45(fish));
  let t = over(fish, over(smallfish, rot(rot(rot(smallfish)))))
  let u = over(over(over(smallfish, rot(smallfish)), rot(rot(smallfish))), rot(rot(rot(smallfish))))

  if (key == 'r') drawCurve(rot(fish));
  else if (key == 'f') drawCurve(flip(fish));
  else if (key == 'd') drawCurve(beside(flip(fish), fish, 2 / 5, 3 / 5));
  else if (key == 'b') drawCurve(beside(fish, fish));
  else if (key == 'a') drawCurve(above(fish, fish));
  else if (key == 's') drawCurve(smallfish);
  else if (key == 'q') drawCurve(over(fish, rot(rot(fish))));
  else if (key == 't') drawCurve(t);
  else if (key == 'u') drawCurve(u);
  else if (key == 'v') drawCurve(side(2, t, u));
  else if (key == 'c') drawCurve(corner(2, t, u));
  else if (key == 'e') drawCurve(squarelimit(3, t, u));
  else if (key == 'p') drawCurve(shrink(fish));
  else if (key == 'k') drawCurve(shift(fish));   
  else if (key == 'z') drawCurve (above(above(above(above(above(above(above(fish,fish),fish),fish),fish),fish),fish), above(fish,above(fish,above(fish,above(fish,above(fish,above(fish,fish)))))))); //Z is for Zpecial
  else drawCurve(fish);
}

