let capture, vid, staticBG, staticDif, avgImage, movingAvgImage;
let extractionEnabled = false;
let avgPixVals = new Array(400*400*4);
let movingAvgPixVals = new Array(400*400*4);
let gaussAvgPixVals = new Array(400*400*4);
let gaussSumSquares = new Array(400*400*4);
const dif = 20;
const movingAvgWeight = 0.7; //alpha in the moving avg equation
let drawCounter = 0;

function setup() {
  createCanvas(1280, 960);
  capture = createCapture(VIDEO);
  capture.size(640,480);
  capture.hide();
  //img = createImage(width,height);
  initializeAvgVals(cropToSize(capture,640,480,400,400));
  //img2 = createImage(width,height);
  noStroke();
  fill(0);

}

function draw(){
  
  //background(255);
  //capture.loadPixels();
  //img.loadPixels();
  vid = cropToSize(capture,640,480,400,400);
  image(vid,0,0);
  if(extractionEnabled){
    staticDif = subtractBaseline(vid,staticBG,dif);
    image(staticDif,800,0);
    
    drawCounter+=1;
    avgImg = avgOverTime(vid,dif);
    avgImg.filter(BLUR);
    image(avgImg,0,400);
    
    movingAvgImg = movingAvgOverTime(vid,dif);
    movingAvgImg.filter(DILATE);
    image(movingAvgImg,400,400);
    
    gaussAvgImg = gaussAvgOverTime(vid,dif);
    image(gaussAvgImg,800,400);
  }

}

function cropToSize(img,ogwidth,ogheight,nwidth,nheight){

  let nimg = createImage(nwidth,nheight);
  nimg.loadPixels();
  img.loadPixels();
  for(let x = 0; x < nwidth; x++){
    for(let y = 0; y < nheight; y++){
      let ogPixelIndex = ((y*ogwidth)+x)*4;
      let newPixelIndex = ((y*nwidth)+x)*4;
      nimg.pixels[newPixelIndex] = img.pixels[ogPixelIndex];
      nimg.pixels[newPixelIndex+1] = img.pixels[ogPixelIndex+1];
      nimg.pixels[newPixelIndex+2] = img.pixels[ogPixelIndex+2];
      nimg.pixels[newPixelIndex+3] = img.pixels[ogPixelIndex+3];
    }
  }
  nimg.updatePixels();
  img.updatePixels();
  return nimg;
}

function keyPressed(){
  if(keyCode === 32){ //spacebar
    //in an ideal world this works first try --> update: it is not an ideal world
    staticBG = cropToSize(capture, 640, 480, 400, 400);
    image(staticBG, 400, 0);
    extractionEnabled = true;
    drawCounter = 0;
    initializeAvgVals(staticBG);
  }
}

function subtractBaseline(vid, static, d){
  vid.loadPixels();
  static.loadPixels();
  let nimg = createImage(400,400);
  nimg.loadPixels();
  let vidR, vidG, vidB, staticR, staticG, staticB;
  let dr, dg, db;
  let intensityDif;

  for(let i = 0; i < vid.pixels.length; i+=4){
    //make the formulas easier to read and just set the values clearly <3
    
    vidR = vid.pixels[i];
    vidG = vid.pixels[i+1];
    vidB = vid.pixels[i+2];

    staticR = static.pixels[i];
    staticG = static.pixels[i+1];
    staticB = static.pixels[i+2];

    dr = vidR-staticR;
    dg = vidG-staticG;
    db = vidB-staticB;

    intensityDif = Math.sqrt(Math.pow(dr,2)+Math.pow(dg,2)+Math.pow(db,2));
    

    if(intensityDif > d){
      nimg.pixels[i] = vidR;
      nimg.pixels[i+1] = vidG;
      nimg.pixels[i+2] = vidB;
      nimg.pixels[i+3] = 255;
    }
    else{
      nimg.pixels[i] = 0;
      nimg.pixels[i+1] = 0;
      nimg.pixels[i+2] = 0;
      nimg.pixels[i+3] = 255;
    }
    
  }
  
  nimg.updatePixels();
  vid.updatePixels();
  static.updatePixels();
  return nimg;

}

function avgOverTime(vid, d){
  
  vid.loadPixels();
  let nimg = createImage(400,400);
  nimg.loadPixels();
  let vidR, vidG, vidB, avgR, avgG, avgB;
  let dr, dg, db;
  let intensityDif;
  let prevAvg, avgUpdate, newAvg;

  for(let i = 0; i < vid.pixels.length; i+=4){
    //similar to prev function, but finding dif in intensity with
    //average instead of baseline/static image
    
    vidR = vid.pixels[i];
    vidG = vid.pixels[i+1];
    vidB = vid.pixels[i+2];
    
    avgR = avgPixVals[i];
    avgG = avgPixVals[i+1];
    avgB = avgPixVals[i+2];
    
    dr = vidR-avgR;
    dg = vidG-avgG;
    db = vidB-avgB;

    intensityDif = Math.sqrt(Math.pow(dr,2)+Math.pow(dg,2)+Math.pow(db,2));
    
    //update values of avgs using running average formula
    avgPixVals[i] = avgR + (1/drawCounter)*(dr);
    avgPixVals[i+1] = avgG + (1/drawCounter)*(dg);
    avgPixVals[i+1] = avgB + (1/drawCounter)*(db);

    if(intensityDif > d){
      nimg.pixels[i] = vidR;
      nimg.pixels[i+1] = vidG;
      nimg.pixels[i+2] = vidB;
      nimg.pixels[i+3] = 255;
    }
    else{
      nimg.pixels[i] = 0;
      nimg.pixels[i+1] = 0;
      nimg.pixels[i+2] = 0;
      nimg.pixels[i+3] = 255;
    }
    
  }
  
  nimg.updatePixels();
  vid.updatePixels();
  return nimg;

  
}

function movingAvgOverTime(vid, d){

  //works basically the same as the avgOverTime function
  //but accessing the movingAvgPixVals array instead
  //and changing the calculation done to it
  vid.loadPixels();
  let nimg = createImage(400,400);
  nimg.loadPixels();
  let vidR, vidG, vidB, avgR, avgG, avgB;
  let dr, dg, db;
  let intensityDif;
  let prevAvg, avgUpdate, newAvg;

  for(let i = 0; i < vid.pixels.length; i+=4){

    
    vidR = vid.pixels[i];
    vidG = vid.pixels[i+1];
    vidB = vid.pixels[i+2];
    
    avgR = movingAvgPixVals[i];
    avgG = movingAvgPixVals[i+1];
    avgB = movingAvgPixVals[i+2];
    
    dr = vidR-avgR;
    dg = vidG-avgG;
    db = vidB-avgB;

    intensityDif = Math.sqrt(Math.pow(dr,2)+Math.pow(dg,2)+Math.pow(db,2));
    
    //update values of avgs using moving average formula
    //(movingAvgWeight corresponds to alpha)
    movingAvgPixVals[i] = avgR + movingAvgWeight*dr;
    movingAvgPixVals[i+1] = avgG + movingAvgWeight*dg;
    movingAvgPixVals[i+1] = avgB + movingAvgWeight*db;

    if(intensityDif > d){
      nimg.pixels[i] = vidR;
      nimg.pixels[i+1] = vidG;
      nimg.pixels[i+2] = vidB;
      nimg.pixels[i+3] = 255;
    }
    else{
      nimg.pixels[i] = 0;
      nimg.pixels[i+1] = 0;
      nimg.pixels[i+2] = 0;
      nimg.pixels[i+3] = 255;
    }
    
  }
  
  nimg.updatePixels();
  vid.updatePixels();
  return nimg;

  
}

function gaussAvgOverTime(vid, d){

  //works basically the same as the avgOverTime function
  //but accessing the movingAvgPixVals array instead
  //and changing the calculation done to it
  vid.loadPixels();
  let nimg = createImage(400,400);
  nimg.loadPixels();
  let vidR, vidG, vidB, avgR, avgG, avgB, ssR, ssG, ssB, sdR, sdG, sdB;
  let dr, dg, db;
  let intensityDif;
  let prevAvg, avgUpdate, newAvg;

  for(let i = 0; i < vid.pixels.length; i+=4){

    
    vidR = vid.pixels[i];
    vidG = vid.pixels[i+1];
    vidB = vid.pixels[i+2];
    
    avgR = gaussAvgPixVals[i];
    avgG = gaussAvgPixVals[i+1];
    avgB = gaussAvgPixVals[i+2];
    
    ssR = gaussSumSquares[i];
    ssG = gaussSumSquares[i+1];
    ssB = gaussSumSquares[i+2];
    
    dr = vidR-avgR;
    dg = vidG-avgG;
    db = vidB-avgB;
    
    //update values of avgs using running average formula
    gaussAvgPixVals[i] = avgR + (1/drawCounter)*(dr);
    gaussAvgPixVals[i+1] = avgG + (1/drawCounter)*(dg);
    gaussAvgPixVals[i+1] = avgB + (1/drawCounter)*(db);
    
    //update values of sum squares.
    gaussSumSquares[i] = ssR + (vidR-avgR)*(vidR-gaussAvgPixVals[i]);
    gaussSumSquares[i+1] = ssG + (vidG-avgG)*(vidG-gaussAvgPixVals[i+1]);
    gaussSumSquares[i+2] = ssB + (vidB-avgB)*(vidB-gaussAvgPixVals[i+2]);
    
    //calculate standard deviations.
    sdR = (1/(drawCounter-1))*ssR;
    sdG = (1/(drawCounter-1))*ssG;
    sdB = (1/(drawCounter-1))*ssB;
    
    //intensityDif now factors in standard deviation by dividing.
    intensityDif = Math.sqrt(Math.pow(dr/sdR,2)+Math.pow(dg/sdG,2)+Math.pow(db/sdB,2));

    if(intensityDif > d){
      nimg.pixels[i] = vidR;
      nimg.pixels[i+1] = vidG;
      nimg.pixels[i+2] = vidB;
      nimg.pixels[i+3] = 255;
    }
    else{
      nimg.pixels[i] = 0;
      nimg.pixels[i+1] = 0;
      nimg.pixels[i+2] = 0;
      nimg.pixels[i+3] = 255;
    }
    
  }
  
  print(sdR);
  nimg.updatePixels();
  vid.updatePixels();
  return nimg;

  
}

function initializeAvgVals(vid){
  
  vid.loadPixels();
  for(let i = 0; i < vid.pixels.length; i+=4){
    
    avgPixVals[i] = vid.pixels[i];
    movingAvgPixVals[i] = vid.pixels[i];
    gaussAvgPixVals[i] = vid.pixels[i];
    gaussSumSquares[i] = 0;
    avgPixVals[i+1] = vid.pixels[i+1];
    movingAvgPixVals[i+1] = vid.pixels[i+1];
    gaussAvgPixVals[i+1] = vid.pixels[i+1];
    gaussSumSquares[i+1] = 0;
    avgPixVals[i+2] = vid.pixels[i+2];
    movingAvgPixVals[i+2] = vid.pixels[i+2];
    gaussAvgPixVals[i+2] = vid.pixels[i+2];
    gaussSumSquares[i+2] = 0;
    //theoretically these will never be needed (alpha)
    //but fuck it we initialize just in case I guess
    avgPixVals[i+3] = 255;
    movingAvgPixVals[i+3] = 255;
    gaussAvgPixVals[i+3] = 255;
    gaussSumSquares[i+3] = 0;
  }
}
