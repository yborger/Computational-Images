let font;
let mat = new ProjectionMatrix();

function preload() {
	font = loadFont("Inconsolata-Regular.ttf");
}

function setup() {
	frameRate(25);
	createCanvas(windowWidth - 10, windowHeight - 10, WEBGL);
	background(255);
	mat.edit = true;
	capture = createCapture(VIDEO);
	capture.size(width,height);
	capture.hide();
	img = createImage(width,height);
}

function draw() {
	background(0);

	// apply the translation matrix with debug turned on
	mat.apply(2);

	/*
	// draw some text to show that it is also affected by the rendering
	textFont(font, 200);
	noStroke();
	fill(80);
	text("Projection test", 100, 200);

	// draw a checkerboard pattern centered on the screen
	
	push();
	translate((1920 - 800) / 2, (1080 - 800) / 2 + 100);

	stroke(100);
	noFill();
	rect(0, 0, 800, 800);

	noStroke();
	fill(255);
	for (let y = 0; y < 8; y++)
		for (let x = (y & 1); x < 8; x += 2)
			rect(x * 100, y * 100, 100, 100);
	pop();
	*/

	//lab 1 stuff

	
	capture.loadPixels();
	img.loadPixels();

	if(key === 'h'){
		dotted();
	  }
	  else if (key === 'g'){
		grayscale();
	  }
	  else if (key === 'w'){
		weightedGrayscale();
	  }
	  else if (key === 't'){
		threshold();
	  }
	  else if (key === 'd'){
		dither();
	  }
	  else{
		textFont(font, 100);
		noStroke();
		fill(80);
	    text("Press keys for effects:\nh = half-tones\ng = grayscale\nw = weighted grayscale\nt = threshold\nd = dither", 33, 65);
	  }

}

//lab 1 functions

function dotted(){
	const stepSize = round(constrain(mouseX / 8, 6, 32));
	for(let y = 0; y < height; y += stepSize){
	  for(let x = 0; x < width; x += stepSize){
		const i = y * width + x;
		const darkness = (255 - capture.pixels[i*4])/255; 
		const radius = stepSize * darkness;
		ellipse(x,y,radius,radius);
	  }
	}
  }
  
function grayscale(){
  
	
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
		//we figured out the problem. The above statements were using img.pixels instead of
		//capture.pixels. We were reading a blank image into a blank image.
  
		const brightness = (r+g+b)/3;
		img.pixels[i*4] = brightness; //R
		img.pixels[i*4+1] = brightness; //G
		img.pixels[i*4+2] = brightness; //B
		img.pixels[i*4+3] = 255;
	  }
	}
  
	
  
	/*
	for(let pls = 0; pls < capture.pixels.length; pls += 4){
	  let r = capture.pixels[pls];
	  let g = capture.pixels[pls+1];
	  let b = capture.pixels[pls+2];
	  let a = capture.pixels[pls+3];
	  const brightness = (r+g+b)/3;
	  img.pixels[pls] = brightness;
	  img.pixels[pls+1] = brightness;
	  img.pixels[pls+2] = brightness;
	  img.pixels[pls+3] = 255;
	}
	*/
  
	img.updatePixels();
	image(img,0,0,width,height);
  }
  
  function weightedGrayscale(){
  
	for(let y = 0; y < height; y ++){
	  for(let x = 0; x < width; x ++){
		const i = y * width + x;
  
		let r = capture.pixels[i*4];
		let g = capture.pixels[i*4+1];
		let b = capture.pixels[i*4+2];
  
		const brightness = (0.3*r+0.59*g+0.11*b);
		img.pixels[i*4] = brightness; //R
		img.pixels[i*4+1] = brightness; //G
		img.pixels[i*4+2] = brightness; //B
		img.pixels[i*4+3] = 255;
	  }
	}
  
	img.updatePixels();
	image(img,0,0,width,height);
  
  }
  
  function threshold(){
  
	//This is the grayscale code, reused from from the non-weighted grayscale function.
	for(let y = 0; y < height; y ++){
	  for(let x = 0; x < width; x ++){
		const i = y * width + x;
		let r = capture.pixels[i*4];
		let g = capture.pixels[i*4+1];
		let b = capture.pixels[i*4+2];
  
		let brightness = (r+g+b)/3;
		//The only difference is the following line, which thresholds the brightness values.
		if(brightness < 127){
		  brightness = 0;
		}
		else{
		  brightness = 255;
		}
		img.pixels[i*4] = brightness; //R
		img.pixels[i*4+1] = brightness; //G
		img.pixels[i*4+2] = brightness; //B
		img.pixels[i*4+3] = 255;
	  }
	}
  
	img.updatePixels();
	image(img,0,0,width,height);
  
  }
  
  function dither(){
  
  
  
	//First, converts the image to grayscale normally,
	for(let y = 0; y < height; y ++){
	  for(let x = 0; x < width; x ++){
		const i = y * width + x;
  
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
	
	//Now, thresholds each pixel, calculates the error, and propagates it
	//to other pixels using floyd-steinberg dithering.
  
	let error;
	let oldBrightness;
	for(let y = 0; y < height; y ++){
	  for(let x = 0; x < width; x ++){
		const i = y * width + x;
  
		oldBrightness = img.pixels[i*4]; //store prev value of pixel
  
		if(img.pixels[i*4]<127){
		  img.pixels[i*4] = 0;
		}
		else{
		  img.pixels[i*4] = 255;
		}
		img.pixels[i*4+1] = img.pixels[i*4]; //we've just been altering the red values here so now we update the others to match
		img.pixels[i*4+2] = img.pixels[i*4];
		img.pixels[i*4+3] = 255; //can't forget about that alpha
  
		
		error = oldBrightness - img.pixels[i*4];
  
  
		//If pixel is not on the left edge or bottom edge, propagate error down and left
		if(x > 0 && y < height-1){
		  const j = i + width - 1;
		  img.pixels[j*4] += (error*0.1875); //error * 3/16
		}
  
		//If pixel is not on the right edge, propagate error right
		if(x < width-1) {
		  const j = i + 1;
		  img.pixels[j*4] += (error*0.4375); //error * 7/16
		  //If pixel is ALSO not on the bottom edge, propagate error right and down
		  if(y < height-1){
			const k = i + width + 1;
			img.pixels[k*4] += (error*0.0625); //error * 1/16
		  }
		}
  
		//If pixel is not on the bottom edge, propagate error down
		if(y < height-1){
		  const j = i + width;
		  img.pixels[j*4] += (error*0.3125); //error * 5/16
		}
  
	  }
	}
  
	img.updatePixels();
	image(img,0,0,width,height);
  }



