let p1 = []; //clicked
let p2 = []; //window
let p3 = [];
let p4 = [];
let homography_jf, homography2;
let screenie;
let face1, face2;
let bgImg;

function openCVReady() {
  cv['onRuntimeInitialized']=()=>{
    homography_cv  = cv.Mat.eye(3,3, cv.CV_32F);
  }
}

function setup() {
  createCanvas(640, 1000);
  cap = createCapture(VIDEO);
  cap.size(640, 480);
  cap.hide();
  screenie = loadImage('saloonTrans.png');
  //homography_cv = cv.Mat.eye(3, 3, cv.CV_32F);

  homography_jf = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
  homography_jf.data[0] = 1;
  homography_jf.data[4] = 1;
  homography_jf.data[8] = 1;

  p2.push(new p5.Vector(195, 185, 1));
  p2.push(new p5.Vector(320, 185, 1));
  p2.push(new p5.Vector(320, 345, 1));
  p2.push(new p5.Vector(195, 345, 1));

  p4.push(new p5.Vector(365, 250, 1));
  p4.push(new p5.Vector(487, 250, 1));
  p4.push(new p5.Vector(487, 411, 1));
  p4.push(new p5.Vector(365, 411, 1));
  pixelDensity(1);

  bgImg = createImage(width,height);
  bgImg.loadPixels();
  for(let pix = 0; pix < bgImg.pixels.length; pix+=4){
    bgImg.pixels[pix] = 0;
    bgImg.pixels[pix+1] = 0;
    bgImg.pixels[pix+2] = 0;
    bgImg.pixels[pix+3] = 255;
  }
  bgImg.updatePixels();
}

function draw() {
  screenie.resize(640, 0);
  //image(screenie,0,0);
  //background(0);
  

  if (key == 'i')      jsfeat_insert(cap);
  else if (key == 'e'){ background(0); jsfeat_extract(cap);}
  //else if (key == 'j') opencv_insert(cap); //able to grab the video and resize
  //else if (key == 'f') opencv_extract(cap);
  else if (key == 'q'){
    special_function(cap);
    //image(screenie,0,0);
  }
  else                 image(cap,0,0);

  // draw the selected points
  fill(255, 255, 0);
  for (let i = 0; i < p1.length; i++) {
    ellipse(p1[i].x, p1[i].y, 2, 2);
    text(i, p1[i].x, p1[i].y);
  }
  for (let i = 0; i < p3.length; i++) {
    ellipse(p3[i].x, p3[i].y, 2, 2);
    text(i, p3[i].x, p3[i].y);
  }

  //text(mouseX+", "+mouseY, mouseX, mouseY);

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
//yes we restructured the whole function :D

  if (p3.length >= 4){
    p1 = [];
    p3 = [];
  }

  if (p1.length >= 4){//more than 4 no homo
    let v = new p5.Vector(mouseX, mouseY, 1);
    p3.push(v);
    if(p3.length >= 4){
      homography_jf = estimate_jsfeat(p1,p2);
      homography2 = estimate_jsfeat(p3,p4);
    }
  }
  else{
    let v = new p5.Vector(mouseX, mouseY, 1);
    p1.push(v);
  }

  /*
    if p1 is 4
      start push to 3
      if p3 >= 4
        calc p2
        calc p4
        reset p1
        reset p3
  */

}

let source, dest;

function jsfeat_insert(img) {
  // TODO: Insert img into the sketch using the jsfeat homography
  //background(0);
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


function generalizedExtract(srcImg,destImg,pA,pB){

  //TODO: Modify such that it can take pixels from the specified srcImg to the specified destImg

  srcImg.loadPixels();
  destImg.loadPixels();

  for(let x = 0; x < srcImg.width; x++){
    for(let y = 0; y < srcImg.height; y++){
      let idx = (y * srcImg.width + x) * 4;
      
      let temp_homography = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
      temp_homography.data[0] = 1;
      temp_homography.data[4] = 1;
      temp_homography.data[8] = 1;
    


      let v = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
      v.data[0] = x;
      v.data[1] = y;
      v.data[2] = 1; 


      jsfeat.math.perspective_4point_transform(temp_homography, 
        pA[0].x, pA[0].y, pB[0].x, pB[0].y,
        pA[1].x, pA[1].y, pB[1].x, pB[1].y,
        pA[2].x, pA[2].y, pB[2].x, pB[2].y,
        pA[3].x, pA[3].y, pB[3].x, pB[3].y);
      //temp_homography now has the 3x3 homography relating the whole image and the selection ?

      
      let newvector = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
      jsfeat.matmath.multiply(newvector, temp_homography, v);
      let nx = (newvector.data[0]);
      let ny = (newvector.data[1]);
      let nw = (newvector.data[2]);
      nx = Math.round(nx / nw);
      ny = Math.round(ny / nw);
      if(nx >= 0 && nx < destImg.width && ny >= 0 && ny < destImg.height){
        let newidx = (ny * destImg.width + nx) * 4;
        destImg.pixels[newidx] = srcImg.pixels[idx];
        destImg.pixels[newidx + 1] = srcImg.pixels[idx + 1];
        destImg.pixels[newidx + 2] = srcImg.pixels[idx + 2];
        destImg.pixels[newidx + 3] = srcImg.pixels[idx + 3];
      }
    }
  }
  //srcImg.updatePixels();
  destImg.updatePixels();
  text("extract (JSFEAT)", 20, 20);
}

//test function
function specialInsert(srcImg, destImg, pA, pB) {
  // TODO: Insert img into the sketch using the jsfeat homography
  //background(0);
  srcImg.loadPixels();
  destImg.loadPixels();
  // perform forward warping
  for (let x = 0; x < srcImg.width; x++) {
    for (let y = 0; y < srcImg.height; y++) {
      let idx = (y * srcImg.width + x) * 4;

      let homo = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
      homo.data[0] = 1;
      homo.data[4] = 1;
      homo.data[8] = 1;

      jsfeat.math.perspective_4point_transform(homo, 
        pA[0].x, pA[0].y, pB[0].x, pB[0].y,
        pA[1].x, pA[1].y, pB[1].x, pB[1].y,
        pA[2].x, pA[2].y, pB[2].x, pB[2].y,
        pA[3].x, pA[3].y, pB[3].x, pB[3].y);

      let v = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
      v.data[0] = x;
      v.data[1] = y;
      v.data[2] = 1;
      let newvector = new jsfeat.matrix_t(1, 3, jsfeat.F32_t | jsfeat.C1_t);
      jsfeat.matmath.multiply(newvector, homo, v);
      let nx = (newvector.data[0]);
      let ny = (newvector.data[1]);
      let nw = (newvector.data[2]);
      nx = Math.round(nx / nw);
      ny = Math.round(ny / nw);
      if(nx >= 0 && nx < destImg.width && ny >= 0 && ny < destImg.height){
        let newidx = (ny * destImg.width + nx) * 4;
        pixels[newidx] = srcImg.pixels[idx];
        destImg.pixels[newidx + 1] = srcImg.pixels[idx + 1];
        destImg.pixels[newidx + 2] = srcImg.pixels[idx + 2];
        destImg.pixels[newidx + 3] = srcImg.pixels[idx + 3];
      }
    }
  }
  
  destImg.updatePixels();
  text("insert (JSFEAT)", 20, 20);
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

// I grabbed the code from our lab 6 this is literally a copy-paste of our lab 6 ok cool now we can add

function special_function(img){

  img.loadPixels();
  //loadPixels();

  /*
  let clickedCOORDS = cv.matFromArray(4, 1, cv.CV_32FC2,
      [p2[0].x, p2[0].y,
      p2[1].x, p2[1].y,
      p2[2].x, p2[2].y,
      p2[3].x, p2[3].y]);
  */


  face1 = getSmallerImage(p1, img);
  face2 = getSmallerImage(p3, img);

  let newBgImg = bgImg.get();

  //generalizedExtract(face1,newBgImg,p1,p2);
  //generalizedExtract(face2,newBgImg,p3,p4);


  image(newBgImg,0,0);
  image(face1,p2[0].x,p2[0].y);
  image(face2,p4[0].x,p4[0].y);


}

//helper function for extracting a smaller image using previously-unused distance calc code from prev lab.
function getSmallerImage(p, img){

  /*
  let distTOP1 = Math.sqrt(Math.pow(p[1].x - p[0].x, 2) + Math.pow(p[1].y - p[0].y, 2));
  let distRIGHT1 = Math.sqrt(Math.pow(p[2].x - p[1].x, 2) + Math.pow(p[2].y - p[1].y, 2));
  let distBOTTOM1 = Math.sqrt(Math.pow(p[3].x - p[2].x, 2) + Math.pow(p[3].y - p[2].y, 2));
  let distLEFT1 = Math.sqrt(Math.pow(p[0].x - p[3].x, 2) + Math.pow(p[0].y - p[3].y, 2));
  let distWIDTH1, distHEIGHT1;
  if(distTOP1 > distBOTTOM1) distWIDTH1 = distTOP1; 
  else distWIDTH1 = distBOTTOM1;

  if(distRIGHT1 > distLEFT1) distHEIGHT1 = distRIGHT1;
  else distHEIGHT1 = distLEFT1;
  */

  let nimg = img.get();
  nimg.loadPixels();
  for(let x = 0; x < nimg.width; x++){
    for(let y = 0; y < nimg.height; y++){
      //check if it's within the bounds we've specified
      if( (x < p[0].x && x <p[3].x) || (x > p[1].x && x > p[2].x) || (y < p[0].y && y < p[1].y) || (y > p[2].y && y > p[3].y)){
        let alphaIndex = ((y*nimg.width)+x)*4 + 3;
        nimg.pixels[alphaIndex] = 0;
      }
    }
  }
  nimg.updatePixels();
  return nimg;
  //return img.get(p[0].x,p[0].y,distWIDTH1,distHEIGHT1);

}
