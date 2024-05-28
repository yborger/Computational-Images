'use strict'
let capture;
let img;
let img2;


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
  [-1, -2, -1],
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

}

function draw(){
  background(255);
  capture.loadPixels();
  
  img = grayscale(capture);
  img = boxBlur(img);

  img.updatePixels();
  background(255);
  image(img,0,0);

}

function grayscale(img){

  img.loadPixels();

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


function boxBlur(img){

  return convoluteImage(img, box);

}


 //pixel by pixel scan, you are given the pixel exactly and what
 //matrix to do on that pixel
function convolutePixel(x,y, matrx, oldImgPixels, newImg,halfHeight,halfWidth){
  
  const i = y * width + x; //yay x2
  /*
  const halfHeight = Math.floor(matrx.length/2); //of the MATRX
  const halfWidth = Math.floor(matrx[0].length/2);
  print(halfWidth);
  */
  let matrix_xpos;
  let matrix_ypos;
  let sum = 0;
  let coeff;
  let j;
  for(let north = 0-halfHeight; north <= halfHeight; north++){
    //print(north);
    matrix_ypos = north + halfHeight;
    for(let west = 0-halfWidth; west <= halfWidth; west++){
      matrix_xpos = west + halfWidth;
      j = i + matrix_ypos * width + matrix_xpos; //this will be the index of pixel j
      j = j*4; //this will be the red value of pixel j
      coeff = matrx[matrix_ypos][matrix_xpos];
      print("HELLO????");
      sum += oldImgPixels[j]*coeff;
    }
  }
  sum = constrain(sum, 0, 255)
  return sum;

  /*newImg.pixels[i*4] = sum;
  newImg.pixels[i*4 + 1] = sum;
  newImg.pixels[i*4 + 2] = sum;
  newImg.pixels[i*4 + 3] = 255;
  */
  
  /*
  newImg.pixels[i*4] = oldImg.pixels[i*4];
  newImg.pixels[i*4 + 1] = oldImg.pixels[i*4 + 1];
  newImg.pixels[i*4 + 2] = oldImg.pixels[i*4 + 2];
  newImg.pixels[i*4 + 3] = 255;
  */
 
}

function convoluteImage(img, matrx){
  //yep math.floor that number
  img.loadPixels();
  let nimg = createImage(width,height); //yay
  nimg.loadPixels();
  const halfHeight = Math.floor(matrx.length/2);
  //print(matrx.length);
  const halfWidth = Math.floor(matrx[0].length/2);
  let pixValue;
  let pixIndex;
  for(let y = halfHeight; y < (height - halfHeight); y++){
    for(let x = halfWidth; x < (width - halfWidth); x++){
      //cool we are now super in the bounds let's GOOOOOOO
      //no need to constrain when our for-loop does it for us
      pixIndex = y * width + x;
      pixValue = convolutePixel(x,y,matrx,img.pixels,halfHeight,halfWidth);
      nimg.pixels[pixIndex*4] = pixValue;
      nimg.pixels[pixIndex*4 + 1] = pixValue;
      nimg.pixels[pixIndex*4 + 2] = pixValue;
      nimg.pixels[pixIndex*4 + 3] = 255;
    }
  }
  return nimg;
}