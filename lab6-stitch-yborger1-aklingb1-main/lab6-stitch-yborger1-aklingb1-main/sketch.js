let p1 = []; //clicked
let p2 = []; //window
let homography_jf, homography_cv;
let screenie;

function openCVReady() {
  cv['onRuntimeInitialized']=()=>{
    homography_cv  = cv.Mat.eye(3,3, cv.CV_32F);
  }
}

function setup() {
  createCanvas(640, 480);
  cap = createCapture(VIDEO);
  cap.size(width, height);
  cap.hide();
  screenie = loadImage('perspective.jpg');
  //homography_cv = cv.Mat.eye(3, 3, cv.CV_32F);

  homography_jf = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
  homography_jf.data[0] = 1;
  homography_jf.data[4] = 1;
  homography_jf.data[8] = 1;

  p2.push(new p5.Vector(0, 0, 1));
  p2.push(new p5.Vector(cap.width, 0, 1));
  p2.push(new p5.Vector(cap.width, cap.height, 1));
  p2.push(new p5.Vector(0, cap.height, 1));
  pixelDensity(1);
}

function draw() {
  screenie.resize(640, 480);
  //image(screenie,0,0);
  //background(0);
  
  if (key == 'i')      jsfeat_insert(cap);
  else if (key == 'e'){ background(0); jsfeat_extract(cap);}
  else if (key == 'j') opencv_insert(cap); //able to grab the video and resize
  else if (key == 'f') opencv_extract(cap);
  else                 image(cap, 0, 0); //the image here is the cosntant bg

  // draw the selected points
  fill(255, 255, 0);
  for (let i = 0; i < p1.length; i++) {
    ellipse(p1[i].x, p1[i].y, 2, 2);
    text(i, p1[i].x, p1[i].y);
  }
}

function estimate_jsfeat(p1, p2) {
  // given a two lists of cooresponding points (4 in each),
  // return the homography that relates them (jsfeat)
  jsfeat.math.perspective_4point_transform(homography_jf,
    p2[0].x, p2[0].y, p1[0].x, p1[0].y,
    p2[1].x, p2[1].y, p1[1].x, p1[1].y,
    p2[2].x, p2[2].y, p1[2].x, p1[2].y,
    p2[3].x, p2[3].y, p1[3].x, p1[3].y);
  return homography_jf
}

function estimate_cv(p1, p2) {
  // given a two lists of cooresponding points (4 in each),
  // return the homography that relates them (opencv)
  let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2,
    [p2[0].x, p2[0].y,
    p2[1].x, p2[1].y,
    p2[2].x, p2[2].y,
    p2[3].x, p2[3].y]);
  let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2,
    [p1[0].x, p1[0].y,
    p1[1].x, p1[1].y,
    p1[2].x, p1[2].y,
    p1[3].x, p1[3].y]);
  let homography_cv = cv.getPerspectiveTransform(srcTri, dstTri);
  srcTri.delete(); dstTri.delete();
  return homography_cv;
}

function mousePressed() {

  if (p1.length >= 4) p1 = [];
  let v = new p5.Vector(mouseX, mouseY, 1);
  p1.push(v);

  if (p1.length == p2.length && p1.length >= 4) {
    homography_jf = estimate_jsfeat(p1, p2);
    homography_cv = estimate_cv(p1, p2);
  }
}

let source, dest;

function jsfeat_insert(img) {
  // TODO: Insert img into the sketch using the jsfeat homography
  background(0);
  img.loadPixels();
  loadPixels();
  // perform forward warping
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let idx = (y * img.width + x) * 4;
      // TODO: update the pixels array using forward warping:
      // create 3x1 vectors using:
      //     let v = jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
      // multiple that vector by a matrix (nv = M * v): 
      //     jsfeat.matmath.multiply(nv, M, v);
      // invert a 3x3:
      //     jsfeat.matmath.invert_3x3(from:matrix_t, to:matrix_t);
      let v = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
      v.data[0] = x;
      v.data[1] = y;
      v.data[2] = 1; //what should w be?
      let newvector = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
      jsfeat.matmath.multiply(newvector, homography_jf, v);
      let nx = (newvector.data[0]);
      let ny = (newvector.data[1]);
      let nw = (newvector.data[2]);
      nx = Math.round(nx / nw);
      ny = Math.round(ny / nw);
      if(nx >= 0 && nx < width && ny >= 0 && ny < height){
        let newidx = (ny * width + nx) * 4;
        pixels[newidx] = img.pixels[idx];
        pixels[newidx + 1] = img.pixels[idx + 1];
        pixels[newidx + 2] = img.pixels[idx + 2];
        pixels[newidx + 3] = img.pixels[idx + 3];
      }

    }
  }
  
  updatePixels();
  text("insert (JSFEAT)", 20, 20);
}


function jsfeat_extract(img) {
  // TODO: Extract and rectify a quadrangle from img using jsfeat
  img.loadPixels();
  loadPixels();

  for(let x = 0; x < img.width; x++){
    for(let y = 0; y < img.height; y++){
      let idx = (y * width + x) * 4;
      
      let temp_homography = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
      let v = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
      v.data[0] = x;
      v.data[1] = y;
      v.data[2] = 1; 
      //4point transform needs 4xy of start and end
      //p2 has the source
      //p1 has the dest?

      jsfeat.math.perspective_4point_transform(temp_homography, 
        p1[0].x, p1[0].y, p2[0].x, p2[0].y,
        p1[1].x, p1[1].y, p2[1].x, p2[1].y,
        p1[2].x, p1[2].y, p2[2].x, p2[2].y,
        p1[3].x, p1[3].y, p2[3].x, p2[3].y,);
      //temp_homography now has the 3x3 homography relating the whole image and the selection ?
      
      let newvector = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
      jsfeat.matmath.multiply(newvector, temp_homography, v);
      let nx = (newvector.data[0]);
      let ny = (newvector.data[1]);
      let nw = (newvector.data[2]);
      nx = Math.round(nx / nw);
      ny = Math.round(ny / nw);
      if(nx >= 0 && nx < width && ny >= 0 && ny < height){
        let newidx = (ny * width + nx) * 4;
        pixels[newidx] = img.pixels[idx];
        pixels[newidx + 1] = img.pixels[idx + 1];
        pixels[newidx + 2] = img.pixels[idx + 2];
        pixels[newidx + 3] = img.pixels[idx + 3];
      }

    }
  }

  updatePixels();
  text("extract (JSFEAT)", 20, 20);
}


function opencv_insert(img) {
  // TODO: Insert img into the sketch using opencv
  background(0);
  nimg = createImage(img.width, img.height);
  img.loadPixels();
  nimg.loadPixels();
  let src = cv.imread(cap.canvas);
  let dst = new cv.Mat();
  let dsize = new cv.Size(src.cols, src.rows);
  cv.warpPerspective(src, dst, homography_cv, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    //src -- the img
    //dst -- where warpPerspective goes
    //homography_cv -- the transformation matrix
    //dsize -- scale of destination
    //constants
  cv.imshow(nimg.canvas, dst);
  image(nimg, 0, 0);
  src.delete(); dst.delete();
  text("insert (OPENCV)", 20, 20);
}

function opencv_extract(img) {
  // TODO: Extract and rectify a quadrangle from img using opencv
  // note: you can invert a matrix in OpencV like this:
  // let hInv = new cv.Mat();
  // cv.invert(h, hInv) 
  // ... later be sure to hInv.delete()

  /*background(0);
  nimg = createImage(img.width, img.height);
  img.loadPixels();
  nimg.loadPixels();
  let src = cv.imread(cap.canvas); //cap.canvas is the canvas
  let dst = new cv.Mat();
  let dsize = new cv.Size(src.cols, src.rows); //not the actual size but the quantity of pixels at the end
  /*let clickedCOORDS = cv.matFromArray(4, 1, cv.CV_32FC2,
    [p2[0].x, p2[0].y,
    p2[1].x, p2[1].y,
    p2[2].x, p2[2].y,
    p2[3].x, p2[3].y]);
  let distTOP = Math.sqrt(Math.pow(p2[1].x - p2[0].x, 2) + Math.pow(p2[1].y - p2[0].y, 2));
  let distRIGHT = Math.sqrt(Math.pow(p2[2].x - p2[1].x, 2) + Math.pow(p2[2].y - p2[1].y, 2));
  let distBOTTOM = Math.sqrt(Math.pow(p2[3].x - p2[2].x, 2) + Math.pow(p2[3].y - p2[2].y, 2));
  let distLEFT = Math.sqrt(Math.pow(p2[0].x - p2[3].x, 2) + Math.pow(p2[0].y - p2[3].y, 2));
  let distWIDTH, distHEIGHT;
  if(distTOP > distBOTTOM) distWIDTH = distTOP; 
  else distWIDTH = distBOTTOM;

  if(distRIGHT > distLEFT) distHEIGHT = distRIGHT;
  else distHEIGHT = distLEFT;
*/

  /*let homography_backup = new cv.Mat();
  cv.invert(homography_cv, homography_backup);

  cv.warpPerspective(src, dst, homography_backup, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

  
  
  cv.imshow(nimg.canvas, src);
  image(nimg, 0, 0);
  src.delete(); dst.delete();
  homography_backup.delete();*/

  //LET THE RECORD SHOW i did the right thing >:(
  background(0);
  nimg = createImage(img.width, img.height);
  img.loadPixels();
  nimg.loadPixels();
  let src = cv.imread(cap.canvas);
  let dst = new cv.Mat();
  let dsize = new cv.Size(src.cols, src.rows);
  let hinv = new cv.Mat();
  cv.invert(homography_cv, hinv);
  cv.warpPerspective(src, dst, hinv, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    //src -- the img
    //dst -- where warpPerspective goes
    //homography_cv -- the transformation matrix
    //dsize -- scale of destination
    //constants
  cv.imshow(nimg.canvas, dst);
  image(nimg, 0, 0);
  src.delete(); dst.delete();
  hinv.delete();

  text("extract (OPENCV)", 20, 20);
}
