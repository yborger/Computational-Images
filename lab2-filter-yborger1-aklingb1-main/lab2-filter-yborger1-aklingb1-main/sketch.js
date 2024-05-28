'use strict'
let capture;
let img;
let img2;
let ctr = 0;
let clicked = false;
let guidetext = true;
let startMillisecond;
let endMillisecond;

const proto_gaussian = [
  [1, 4, 6, 4, 1],
  [4, 16, 24, 16, 4],
  [6, 24, 36, 24, 6],
  [4, 16, 24, 16, 4],
  [1, 4, 6, 4, 1]
];

let gaussian = [[0,0,0,0,0,],[0,0,0,0,0,],[0,0,0,0,0,],[0,0,0,0,0,],[0,0,0,0,0,]];

const proto_box = [
  [1,1,1,1,1],
  [1,1,1,1,1],
  [1,1,1,1,1],
  [1,1,1,1,1],
  [1,1,1,1,1]
];

let box = [[0,0,0,0,0,],[0,0,0,0,0,],[0,0,0,0,0,],[0,0,0,0,0,],[0,0,0,0,0,]];

const hsobel = [
  [(-1), (-2), (-1)],
  [0, 0, 0],
  [1, 2, 1]
]

const vsobel = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1]
]

function setup() {
  createCanvas(640, 480);
  capture = createCapture(VIDEO);
  capture.size(width,height);
  capture.hide();
  img = createImage(width,height);
  //img2 = createImage(width,height);
  noStroke();
  fill(0);
  for(let i = 0; i < proto_gaussian.length; i++){
    for(let j = 0; j < proto_gaussian[i].length; j++){
      gaussian[i][j] = proto_gaussian[i][j]/(256);
    }
  }
  for(let i = 0; i < proto_box.length; i++){
    for(let j = 0; j < proto_box[i].length; j++){
      box[i][j] = proto_box[i][j]/25;
    }
  }

  fill(255);
  stroke(0);
  strokeWeight(4);
  textSize(15);
}

function draw(){
  background(255);
  capture.loadPixels();
  img.loadPixels();

  img = grayscale(capture);
  
  startMillisecond = millis();
  if(key === 'b'){
    img = boxBlur(img);
  }
  else if (key === 'g'){
    img = gauss(img);
  }
  else if (key === 'h'){
    img = hsob(img);
  }
  else if (key === 'v'){
    img = vsob(img);
  }
  else if (key === 's'){
    img = doublesob(img);
  }
  else if (key === 'w'){
    img = blurButWeird(img);
  }
  else if (key === 'f'){
    img = haveFun(img);
  }
  else{
    guidetext = true;
  }
  endMillisecond = millis();

  img.updatePixels();
  background(120);
  image(img,0,0);

  if(guidetext){
    background(120);
    text("Press keys for effects:\nb = box blur\ng = gaussian\nh = horizontal sobel\nv = vertical sobel\ns = sobel\nw = weird blur (combination linear box blur)\nf = 'fun'", 33, 65);
    guidetext = false;
  }


  text("Milliseconds taken to complete funtion: " + (endMillisecond-startMillisecond), 20,20);

}

function grayscale(img){

  for(let y = 0; y < height; y ++){
    for(let x = 0; x < width; x ++){
      const i = y * width + x;
      //i*4 = R
      //i * 4 + 1 = G
      //i * 4 + 2 = B
      //i * 4 + 3 = A (don't, please just don't)
      let r = capture.pixels[i*4];
      let g = capture.pixels[i*4+1];
      let b = capture.pixels[i*4+2];

      const brightness = (r+g+b)/3;
      img.pixels[i*4] = brightness; //R
      img.pixels[i*4+1] = brightness; //G
      img.pixels[i*4+2] = brightness; //B
      img.pixels[i*4+3] = 255;
    }
  }

  return img;
  
}

function boxBlur(inputImg){
  inputImg.loadPixels();
  let img = createImage(width,height);
  img.loadPixels();
  for(let y = 2; y < (height-2); y++){ 
    for(let x = 2; x < (width-2); x++){
      //leaves a border of 2 pixels around the edge this way
      const i = y * width + x; //pixel
      let pixVal = 0;
      let coeff;
      let j;
      let holdPixel;
      let holdSum;
      for(let m_y = -2; m_y <= 2; m_y++){
        for(let m_x = -2; m_x <= 2; m_x++){
          //note: all matrix references are +2
          coeff = box[m_y+2][m_x+2]; //matrix coeff starts at 0,0 in itself now
          holdPixel = 4*(i + width*m_y + m_x); //adjust to be the pixels around it that align with the matrix
          holdSum = coeff * inputImg.pixels[holdPixel];


          pixVal += holdSum;
          //sum -- the sum of the brightness values of all the pixels around teh current pixel
          //multiplied by their corresponding coeffs as specified by the matrix
          //j*4 is the RED value because there's 4 channels in each pixel <3
          //my brain is so fried I am forgetting how to math 
        }
      }
      //matrix navigated! time to fix the individual pixel!
      j = i * 4;
      img.pixels[j] = pixVal;
      img.pixels[j+1] = pixVal;
      img.pixels[j+2] = pixVal;
      img.pixels[j+3] = 255;
    }
  }
  image(img,0,0);
  return img;
}

function gauss(inputImg){
  inputImg.loadPixels();
  let img = createImage(width,height);
  img.loadPixels();
  for(let y = 2; y < (height-2); y++){ 
    for(let x = 2; x < (width-2); x++){
      const i = y * width + x; //pixel
      let pixVal = 0;
      let coeff;
      let j;
      let holdPixel;
      let holdSum;
      for(let m_y = -2; m_y <= 2; m_y++){
        for(let m_x = -2; m_x <= 2; m_x++){
          coeff = gaussian[m_y+2][m_x+2]; 
          holdPixel = 4*(i + width*m_y + m_x); 
          holdSum = coeff * inputImg.pixels[holdPixel];


          pixVal += holdSum;
        }
      }
      j = i * 4;
      img.pixels[j] = pixVal;
      img.pixels[j+1] = pixVal;
      img.pixels[j+2] = pixVal;
      img.pixels[j+3] = 255;
    }
  }
  image(img,0,0);
  return img;
}

function hsob(inputImg){
  inputImg.loadPixels();
  let img = createImage(width,height);
  img.loadPixels();
  for(let y = 1; y < (height-1); y++){ 
    for(let x = 1; x < (width-1); x++){
      const i = y * width + x; //pixel
      let pixVal = 0;
      let coeff;
      let j;
      let holdPixel;
      let holdSum;
      for(let m_y = -1; m_y <= 1; m_y++){
        for(let m_x = -1; m_x <= 1; m_x++){
          coeff = hsobel[m_y+1][m_x+1]; 
          holdPixel = 4*(i + width*m_y + m_x);
          holdSum = coeff * inputImg.pixels[holdPixel];


          pixVal += holdSum;
        }
      }
      j = i * 4;
      //pixVal = Math.abs(pixVal+20);
      //pixVal = constrain(pixVal, 0, 255);
      img.pixels[j] = pixVal;
      img.pixels[j+1] = pixVal;
      img.pixels[j+2] = pixVal;
      img.pixels[j+3] = 255;
    }
  }
  return img;
}

function vsob(inputImg){
  inputImg.loadPixels();
  let img = createImage(width,height);
  img.loadPixels();
  for(let y = 1; y < (height-1); y++){ 
    for(let x = 1; x < (width-1); x++){
      const i = y * width + x; //pixel
      let pixVal = 0;
      let coeff;
      let j;
      let holdPixel;
      let holdSum;
      for(let m_y = -1; m_y <= 1; m_y++){
        for(let m_x = -1; m_x <= 1; m_x++){
          coeff = vsobel[m_y+1][m_x+1]; 
          holdPixel = 4*(i + width*m_y + m_x);
          holdSum = coeff * inputImg.pixels[holdPixel];


          pixVal += holdSum;
        }
      }
      j = i * 4;
      //pixVal = Math.abs(pixVal+20);
      //pixVal = constrain(pixVal, 0, 255);
      img.pixels[j] = pixVal;
      img.pixels[j+1] = pixVal;
      img.pixels[j+2] = pixVal;
      img.pixels[j+3] = 255;
    }
  }
  return img;
}

function doublesob(inputImg){
  inputImg.loadPixels();
  let img = createImage(width,height);
  img.loadPixels();
  for(let y = 1; y < (height-1); y++){ 
    for(let x = 1; x < (width-1); x++){
      const i = y * width + x; //pixel
      let pixVal = 0;
      let coeff;
      let j;
      let holdPixel;
      let holdSum;
      let vsobelResult;
      let hsobelResult;
      for(let m_y = -1; m_y <= 1; m_y++){
        for(let m_x = -1; m_x <= 1; m_x++){
          coeff = vsobel[m_y+1][m_x+1]; 
          holdPixel = 4*(i + width*m_y + m_x);
          holdSum = coeff * inputImg.pixels[holdPixel];
          pixVal += holdSum;
        }
      }
      vsobelResult = pixVal;
      for(let m_y = -1; m_y <= 1; m_y++){
        for(let m_x = -1; m_x <= 1; m_x++){
          coeff = hsobel[m_y+1][m_x+1]; 
          holdPixel = 4*(i + width*m_y + m_x);
          holdSum = coeff * inputImg.pixels[holdPixel];
          pixVal += holdSum;
        }
      }
      hsobelResult = pixVal;
      pixVal = Math.sqrt(Math.pow(hsobelResult, 2), Math.pow(vsobelResult, 2));
      j = i * 4;
      //pixVal = Math.abs(pixVal+20);
      //pixVal = constrain(pixVal, 0, 255);
      img.pixels[j] = pixVal;
      img.pixels[j+1] = pixVal;
      img.pixels[j+2] = pixVal;
      img.pixels[j+3] = 255;
    }
  }
  return img;
}

function blurButWeird(inputImg){
  inputImg.loadPixels();
  let img = createImage(width,height);
  img.loadPixels();
  let weirdBox = [1,1,1,1,1]
  for(let i = 0; i < 5; i++){
    weirdBox[i] = weirdBox[i]/10;
  } 

  for(let y = 2; y < (height-2); y++){ 
    for(let x = 2; x < (width-2); x++){
      const i = y * width + x; //pixel
      let pixVal = 0;
      let coeff;
      let j;
      let holdPixel;
      let holdSum;
      for(let m_y = -2; m_y <= 2; m_y++){
          coeff = weirdBox[m_y+2];
          holdPixel = 4*(i + width*m_y); 
          holdSum = coeff * inputImg.pixels[holdPixel];


          pixVal += holdSum;

      }
      j = i * 4;
      img.pixels[j] = pixVal;
      img.pixels[j+1] = pixVal;
      img.pixels[j+2] = pixVal;
      img.pixels[j+3] = 255;
      //pixVal = 0;
      for(let m_x = -2; m_x <= 2; m_x++){
        coeff = weirdBox[m_x+2]; 
        holdPixel = 4*(i + m_x); 
        holdSum = coeff * img.pixels[holdPixel];


        pixVal += holdSum;
        
    }
      j = i * 4;
      img.pixels[j] = pixVal;
      img.pixels[j+1] = pixVal;
      img.pixels[j+2] = pixVal;
      img.pixels[j+3] = 255;
    }
  }
  return img;


}

function haveFun(img){
  //while writing hsob function, we found an interesting filter
  //and it looks a little like an old vhs but cooler? twas cool
  for(let y = 1; y < (height-1); y++){ 
    for(let x = 1; x < (width-1); x++){
      const i = y * width + x; //pixel
      let pixVal = 0;
      let coeff;
      let j;
      let holdPixel;
      let holdSum;
      for(let m_y = -1; m_y <= 1; m_y++){
        for(let m_x = -1; m_x <= 1; m_x++){
          coeff = hsobel[m_y+1][m_x+1]; 
          holdPixel = 4*(i + width*m_y + m_x);
          holdSum = coeff * capture.pixels[holdPixel];


          pixVal += holdSum;
        }
      }
      j = i * 4;
      //pixVal = Math.abs(pixVal);
      pixVal = constrain(pixVal, 0, 255);
      img.pixels[j] = pixVal;
      img.pixels[j+1] = pixVal;
      img.pixels[j+2] = pixVal;
      img.pixels[j+3] = 255;
    }
  }
  image(img,0,0);
  return img;
}

function mouseClicked(){
  if(clicked){clicked = false;}
  else{clicked = true;}  
}