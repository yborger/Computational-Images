let img;
let clicked;
function setup() {
  createCanvas(400, 400);
  img = loadImage('cherry_border.jpg');
  clicked = false;
}

function draw(){
  //image(img, 0, 0);
  img.resize(400,400);
  image(img, 0, 0);
  //mouseLeaves();
  if(clicked){
    drawTrees();
  }
};

function mouseClicked(){
  if(clicked){clicked = false;}
  else{clicked = true;}  
}

function drawTrees(){
  /*this took me a long time but it was very relaxing*/ 

  stroke(55,34,22); //brown
  
  strokeWeight(30);
  line(-10, 50, 20, -10);

  strokeWeight(5);
  line(65,0,190,55);
  line(190,55,200,55);
  line(190,55,205,70);
  line(205, 70, 203, 76);
  
  strokeWeight(3);
  line(210,60,250,61);
  line(250,61,270,64);
  line(270,64,280,70);
  line(200,56,210,60);
  line(203,76, 205, 95);

  strokeWeight(2);
  line(280,70,290,80);
  line(290,80,300,100);
  line(300,100,317,122);
  line(205,70,220, 77);
  line(220, 77, 247,94);
  line(205,95,200,101);
  line(205,97,205,105);


  strokeWeight(1.5);
  line(247,94,259,93);
  line(259,93,273,100);
  line(273,100, 282, 114);
  line(282, 114, 293, 127);
  line(293,127,306, 143);
  line(306,143,311,152);
  line(247,94, 250,110);
  line(250,110,259,130);
  line(200,101,200,105);
  line(205,105,210,107);
  line(210,107,213,110);
  line(213,110,215,116);
  line(215,116, 217,120);
  line(200,105,190,112);
  line(190,112,186,111);
  line(186,111,183, 113);
  line(183,113,180,114);

  strokeWeight(1);
  line(217,120,218,133);

}



function mouseLeaves(){
  strokeWeight(.1);
  fill(255,204,255, 150+(random(-10,20)));
  ellipse(mouseX+random(-5,5),mouseY+random(-5,5),10,10);
  
}

