let myShader;
let myFont;
let capture;
let shading = false;
let nimg;
function preload() {
  myShader = loadShader('shader.vert', 'shader.frag');
  myFont = loadFont('Inconsolata.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  describe('a simple shader example')
  pixelDensity(1);
  textFont(myFont);
  textSize(36);
  capture = createCapture(VIDEO);
  capture.size(width,height);
  capture.hide();
}

function draw() {
  background(24);

  if(shading){
    shader(myShader);

    // give the shader information about the webcam
    myShader.setUniform("tex0",capture);
    myShader.setUniform("mouseX",mouseX/width);


    // apply the shader to a rectangle taking up the full canvas
    push();
    translate(-width/2, -height/2)
    noStroke();
    rect(0, 0, width, height);
    pop();
    
    // use default p5 renderer to overlay text
    resetShader();
    push();
    fill(134,95,161);
    translate(-width/3, -height/3, 0);
    let frameRate = Math.round(1/deltaTime*1000);
    text("Shader framerate: " + frameRate, 0, 0);
    pop();
  }
  else {
    nimg = threshold(capture);
    image(nimg,-width/2,-height/2);
    fill(134,95,161);
    //translate(-width/3, -height/3, 0);  ?
    let frameRate = Math.round(1/deltaTime*1000);
    text("Non-shader framerate: " + frameRate, 0, 0);
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

//threshold function, copy-pasted from lab 1 with minor tweaks
function threshold(img){

  let nimg = createImage(width,height);
  nimg.loadPixels();
  img.loadPixels();

  for(let y = 0; y < height; y ++){
    for(let x = 0; x < width; x ++){
      const i = y * width + x;
      let r = img.pixels[i*4];
      let g = img.pixels[i*4+1];
      let b = img.pixels[i*4+2];

      let brightness = (r+g+b)/3;
      if(brightness < 127){
        brightness = 0;
      }
      else{
        brightness = 255;
      }
      nimg.pixels[i*4] = brightness; //R
      nimg.pixels[i*4+1] = brightness; //G
      nimg.pixels[i*4+2] = brightness; //B
      nimg.pixels[i*4+3] = 255;
    }
  }

  img.updatePixels();
  nimg.updatePixels();
  return nimg;

}

function keyPressed(){
  if(keyCode === 32){ //spacebar
    shading = !shading;
  }
}