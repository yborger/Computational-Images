let cap, nimg;

function setup() {
  createCanvas(640, 480);
  cap = createCapture(VIDEO);
  cap.size(width / 2, height / 2);
  cap.hide();
}

/***
 * Given a gray scale image, nimg, return a hough histogram
 * nrho: number of distance bins
 * ntheta: number of angle bins
 */
function create_hough(nimg, nrho, ntheta) {
  // create a 2D array: nrho x ntheta
  let hough = Array(nrho).fill().map(() => Array(ntheta).fill(0));

  nimg.loadPixels();
  for (let y = 0; y < cap.height; y++) {
    for (let x = 0; x < cap.width; x++) {
      let cpos = (y * cap.width + x) * 4;
      let s = nimg.pixels[cpos];
      if (s > 0) {
        for (let ti = 0; ti < ntheta; ti++) {
          let theta = map(ti, 0, ntheta, 0, 2 * PI);
          let rho = x * cos(theta) + y * sin(theta);
          let r =
            Math.round(map(rho,
              0, dist(0, 0, cap.width, cap.height),
              0, nrho));
          if (r >= 0 && r < nrho) {
            hough[r][ti]++;
          }
        }
      }
    }
  }
  return hough;
}

/***
 * Given a hough histogram return the largest count
 */
function max_count(hough) {
  let maxcount = 0;
  for (let ri = 0; ri < hough.length; ri++) { 
    for (let ti = 0; ti < hough[ri].length; ti++) { 
      if (hough[ri][ti] > maxcount) maxcount = hough[ri][ti];
    }
  }
  return maxcount;
}

/***
 * TODO: Draw all the lines in the hough histogram
 * i.e., all the lines that have non-zero counts  
 */
let a, b, c;
let mapri, mapti;
function draw_hough_lines(hough) {
  for(let ri = 0; ri < hough.length; ri++){ //Rho Indexing (sorry I got used to reading ri and ti :P)
    for(let ti = 0; ti < hough[ri].length; ti++){ //Theta Indexing
       //TODO for bugfix: map theta and rho back to their proper values from their histogram index value
       mapti = map(ti, 0, 100, 0, 2*PI);
       mapri = Math.round(map(ri, 0, 100, 0, 400)); //we set rho and theta to constants of 100 before

       a = cos(mapti);
       b = sin(mapti);
       //openCV:
       /*
        x0 = a*ri;
        y0 = b*ri;
        x1 = int(x0+1000*(-b));
        y1 = int(y0+1000*(a));
        x2 = int(x0-1000*(-b));
        y2 = int(y0-1000*(a));
       */
       c = -1*(mapri);
       if(hough[ri][ti] > 0){
        stroke('green');
        plotLine(a,b,c);
        //stroke('magenta');
        //line(x1,y1,x2,y2);
        
        //let g = map(hough[ri][ti], 0, max_count(hough), 0, 255);
        //fill(g);
       }
    }
  }
}

/***
 * Visualize the hough histogram as an image.
 * x-axis: angle
 * y-axis: distance from the origin
 * intensity: number of pixels on that line  
 */
function draw_hough(hough) {
  let nrho = hough.length;
  let ntheta = hough[0].length;
  let maxcount = max_count(hough);
  fill(0);
  rect(0, 0, width / 2, height / 2);
  noStroke();
  for (let ri = 0; ri < nrho; ri++) {
    for (let ti = 0; ti < ntheta; ti++) {
      let x = map(ti, 0, ntheta, 0, width / 2);
      let y = map(ri, 0, nrho, 0, height / 2);
      let g = map(hough[ri][ti], 0, maxcount, 0, 255);
      fill(g);
      ellipse(x, y, 3, 3);
    }
  }
}

/***
 * TODO!
 * Given a histogram of lines, return a filtered version
 */
function filter_lines_25(hough) {
  let nrho = hough.length;
  let ntheta = hough[0].length;
  let nhough = Array(nrho).fill().map(() => Array(ntheta).fill(0));
  let max = 0.75*max_count(hough); //top 25%
  for(let rho = 0; rho < hough.length; rho++){
    for(let theta = 0; theta < hough[0].length; theta++){
       if (hough[rho][theta] >= max){ 
        nhough[rho][theta] = max;
       }
    }
  }
  return nhough;
}

function filter_lines(hough) {
  let nrho = hough.length;
  let ntheta = hough[0].length;
  let nhough = Array(nrho).fill().map(() => Array(ntheta).fill(0));
  let max = max_count(hough);
  for(let rho = 0; rho < hough.length; rho++){
    for(let theta = 0; theta < hough[rho].length; theta++){
       if (hough[rho][theta] > 127){ 
        nhough[rho][theta] = hough[rho][theta];
       }
    }
  }
  return nhough;
}

function draw() {
  background(0);

  cap.loadPixels();
  let buffer = new jsfeat.matrix_t(cap.width, cap.height, jsfeat.U8C1_t);
  jsfeat.imgproc.grayscale(cap.pixels, cap.width, cap.height, buffer);
  jsfeat.imgproc.gaussian_blur(buffer, buffer, 5, 0);
  jsfeat.imgproc.canny(buffer, buffer, 50, 255);
  nimg = jsfeatToP5(buffer, nimg);

  const nrho = 100;
  const ntheta = 100;
  let hough = create_hough(nimg, nrho, ntheta);
  let shough = filter_lines(hough);
  let hough_25 = filter_lines_25(hough); //this filters the top 25%, but the one point was easier for debugging


  image(cap, 0, 0); //top left
  stroke(0,255,0);
  //draw_hough_lines(hough); //top left

  image(nimg, width / 2, 0);  //top right

  push();
  translate(0, height / 2); //bottom left
  draw_hough(hough);
  pop();


  push();
  translate(width / 2, height / 2); //bottom right
  draw_hough(shough); //this will draw just the one max point :P we made a funny little filter
  draw_hough_lines(shough); //bottom right

  pop();
}

/***
 * Draw the line 0 = ax * by + c  
 */
function plotLine(a, b, c) {
  if (abs(a) < abs(b)) {
    // mostly horizontal
    line(0, c / -b, width / 2, (a * width / 2 + c) / -b);
  } else {
    //mostly vertical
    line(c / -a, 0, (b * height + c) / -a, height);
  }
}

/***
 * Given a jsfeat 8-bit grayscale matrix return a p5 RGB image
 */
function jsfeatToP5(src, dst) {
  if (!dst || dst.width != src.cols || dst.height != src.rows) {
    dst = createImage(src.cols, src.rows);
  }
  var n = src.data.length;
  dst.loadPixels();
  var srcData = src.data;
  var dstData = dst.pixels;
  for (var i = 0, j = 0; i < n; i++) {
    var cur = srcData[i];
    dstData[j++] = cur;
    dstData[j++] = cur;
    dstData[j++] = cur;
    dstData[j++] = 255;
  }
  dst.updatePixels();
  return dst;
}
