// different binary thresholding functions using histograms
//
// (1) complete the missing functions:
//      - calchist
//      - calcmode
//      - calcmean 
//      - calcminotsu 
//      - calcmaxotsu 
//
// (2) For the report:
//      - show results (binary images) for the different thresholds
//      - find an image where otsu fails; reflect on why it failed? 
//      - describe another way to pick the threshold 
//

let cam;

let thresh = 128;

function setup() {
  createCanvas(640, 480);
  cam = createCapture(VIDEO);
  cam.size(width / 2, height / 2);
  cam.hide();
}

function mousePressed() {
  print("thresh = " + thresh);
}

function keyPressed() {
  if (key == 's') saveCanvas("otsu.png");
}

function drawhist(h) {
  // given a histogram draw the PDF & CDF on the screen
  let sum = 0;
  noStroke();
  for (let i = 0; i < h.length; i++) {
    // draw pdf
    fill(i);
    rect(i, height / 2, 1, h[i] / 10);
    // draw cdf
    sum += h[i];
    rect(width / 2 + i, height / 2, 1, sum / 300);
  }
}

function calchist(img) {

  let h = [];
  for (let i = 0; i < 256; i++) {
    h[i] = 0;
  }

  img.loadPixels();
  for(let i = 0; i < img.pixels.length; i+=4) {
    h[img.pixels[i]]++;
  }
  return h;
}

function calcmode(h) {
  let max = 0;
  let maxIndex = 0;
  for(let i = 0; i < h.length; i++){
    if(h[i] > max){
      max = h[i];
      maxIndex = i;
    }
  }
  return maxIndex;
}

function calcmean(h) {
  //const pixCount = width*height/4;
  let count = 0;
  let sum = 0;
  let current;
  for(let i = 0; i < h.length; i++){
    current = h[i]*i;
    sum += current;
    count += h[i];
  }
  return sum/count;
}

function calcClassProb(h) {

  const pixCount = width*height/4;
  let sum = 0;
  let current;
  for(let i = 0; i < h.length; i++){
    current = h[i];
    current = current/pixCount;
    sum += current;
  }
  return sum;

}

function calcVariance(h, mean, thresh) {
  let sum = 0;
  let distance;
  let count = 0;
  for(let i = 0; i < h.length; i++){
    distance = mean-(i+thresh);
    count += h[i];
    sum += h[i]*Math.pow(distance,2);
  }
  return sum/count;
}

function calcmaxotsu(h) {
  let threshold, betweenClassVariance, newHists, firstHist, secondHist, firstHistMean, secondHistMean, firstHistProb, secondHistProb;
  let maxVariance = 0;
  let maxThreshold = 0;
  for(threshold = 0; threshold < 256; threshold++){
    newHists = splitHist(h,threshold);
    firstHist = newHists[0];
    secondHist = newHists[1];
    firstHistMean = calcmean(firstHist);
    secondHistMean = calcmean(secondHist) + threshold;
    firstHistProb = calcClassProb(firstHist);
    secondHistProb = calcClassProb(secondHist);
    betweenClassVariance = firstHistProb*secondHistProb*Math.pow((firstHistMean-secondHistMean),2);
    if(betweenClassVariance > maxVariance){
      maxVariance = betweenClassVariance;
      maxThreshold = threshold;
    }
  }
  return maxThreshold;
}
/*I think it's fixed now! :D*/
function calcminotsu(h) {
  let threshold, withinClassVariance, newHists, firstHist, secondHist, firstHistMean, secondHistMean, firstHistProb, secondHistProb, firstHistVariance, secondHistVariance;
  let minVariance = Number.MAX_VALUE;
  let minThreshold = 0;
  for(threshold = 0; threshold < 256; threshold++){
    newHists = splitHist(h,threshold);
    firstHist = newHists[0];
    secondHist = newHists[1];
    firstHistMean = calcmean(firstHist);
    secondHistMean = calcmean(secondHist) + threshold;
    firstHistProb = calcClassProb(firstHist);
    secondHistProb = calcClassProb(secondHist);
    firstHistVariance = calcVariance(firstHist,firstHistMean, 0);
    secondHistVariance = calcVariance(secondHist,secondHistMean, threshold);
    withinClassVariance = firstHistProb*firstHistVariance + secondHistProb*secondHistVariance;

    if(withinClassVariance < minVariance){
      minVariance = withinClassVariance;
      minThreshold = threshold;
    }
  }
  return minThreshold;

}


function calcmaxent(h) {
  // TODO: challenge
  // given a histogram return maximum entropy trehshold

  // p(n) = pdf here i believe
  // probability of getting events in entropy
  //note to self: this is wrong, but food is necessary

  //Going to be completely honest: we were going to do this challenge problem and then realized we had the other labs to do, so it is NOT complete :P
  const pixCount = width*height/4;
  let sum = 0;
  let curr;
  let entropyMath;
  for(let i = 0; i < h.length; i++){
    curr = h[i];
    curr = curr/pixCount; //p(n)
    entropyMath = curr * Math.log(curr);
    sum += entropyMath;
  }
  
  return sum * -1;
}


function calcmedian(h) {
  // given a histogram return the median
  let tsum = 0;
  for (let i = 0; i < h.length; i++) {
    tsum += h[i];
  }
  let sum = 0;
  for (let i = 0; i < h.length; i++) {
    sum += h[i];
    if (sum >= tsum / 2) return i;
  }
  return -1;
}

function rgb2gray(img) {
  // convert an p5.Image to grayscale
  let nimg = img.get(); // alternatively createImage(img.width, img.height)
  nimg.loadPixels();
  for (let i = 0; i < nimg.pixels.length; i += 4) {
    //const [r, g, b, a] = nimg.pixels.slice(i, i + 4);
    //const Y = 0.3 * r + 0.59 * g + 0.11 * b;
    const Y = 0.3 * nimg.pixels[i] + 0.59 * nimg.pixels[i + 1] + 0.11 * nimg.pixels[i + 2];
    nimg.pixels[i] = nimg.pixels[i + 1] = nimg.pixels[i + 2] = Y;
  }
  nimg.updatePixels();
  return nimg;
}

function gray2bin(img, thresh) {
  // convert a grayscale p5.Image to black/white based on theshold
  let frame = img.get();
  frame.loadPixels();
  for (let i = 0; i < frame.pixels.length; i += 4) {
    // to gamma correct or not?
    let value = frame.pixels[i];
    //value = pow(ivalue/255.0, 1/2.2)*255;f
    if (value > thresh) {
      frame.pixels[i] = 255;
      frame.pixels[i + 1] = 255;
      frame.pixels[i + 2] = 255;
    }
    else {
      frame.pixels[i] = 0;
      frame.pixels[i + 1] = 0;
      frame.pixels[i + 2] = 0;
    }
  }
  frame.updatePixels();
  return frame;
}

function splitHist(h,threshold) {
  let firstHalf = [];
  let secondHalf = [];
  for(let i = 0; i < h.length; i++){
    if(i < threshold){
      firstHalf.push(h[i]);
    }
    else{
      secondHalf.push(h[i]);
    }
  }
  return [firstHalf,secondHalf];
}

function draw() {
  let frame = rgb2gray(cam);
  background(0, 64, 0);

  image(frame, 0, 0);
  thresh = mouseX % (width / 2);

  let hist = calchist(frame);
  drawhist(hist);

  let e = calcmaxent(hist);
  stroke(255, 255, 255);
  line(e, height / 2, e, height);
  line(e + width / 2, height / 2, e + width / 2, height);

  stroke(255, 255, 0);
  let o1 = calcmaxotsu(hist);
  line(o1, height / 2, o1, height);
  line(o1 + width / 2, height / 2, o1 + width / 2, height);

  stroke(0, 0, 255);
  let o2 = calcminotsu(hist);
  line(o2, height / 2, o2, height);
  line(o2 + width / 2, height / 2, o2 + width / 2, height);
    
  stroke(0, 255, 0);
  let m = calcmedian(hist);
  line(m, height / 2, m, height);
  line(m + width / 2, height / 2, m + width / 2, height);

  stroke(0, 255, 255);
  let u = calcmean(hist);
  line(u, height / 2, u, height);
  line(u + width / 2, height / 2, u + width / 2, height);

  stroke(255, 0, 0);
  let d = calcmode(hist);
  line(d, height / 2, d, height);
  line(d + width / 2, height / 2, d + width / 2, height);

  stroke(206, 0, 206);
  let n = calcmaxent(hist);
  line(n, height / 2, n, height);
  line(n + width / 2, height / 2, n + width / 2, height);

  if (key == 'e') thresh = e;
  if (key == 'u') thresh = u;
  if (key == 'm') thresh = m;
  if (key == 'o') thresh = o1;
  if (key == 'p') thresh = o2;
  if (key == 'd') thresh = d;
  if (key == 'n') thresh = n;


  image(gray2bin(frame, thresh), width / 2, 0);

  stroke(0, 0, 255);
  fill(0, 0, 255);
  rect(thresh - 3, height - 100, 6, 45);
  rect(thresh + width / 2 - 3, height - 100, 6, 45);
}
