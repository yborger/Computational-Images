let img;
let clicked;
let funMouse;
function setup() {
  createCanvas(400, 400);
  img = loadImage('cherry_border.jpg');
  clicked = false;
  funMouse = new System(createVector(mouseX,mouseY));
}

function draw(){
  //image(img, 0, 0);
  img.resize(400,400);
  image(img, 0, 0);
  if(clicked){
    drawTrees();
  }
  
  //floaties
  funMouse.addFloaties();
  funMouse.run();

};
//class: floaties (these are like the particles)

let Floaties = function(position){
  this.gravity = createVector(0, 0.1); //example says acceleration
  this.direction = createVector(random(-1,1), random(-1,0)); //example says velocity
  this.position = position.copy(); //example says position
  this.fade = random(150, 250);
};

Floaties.prototype.run = function(){
  this.update();
  this.display();
}

Floaties.prototype.update = function(){
  this.direction.add(this.gravity);
  this.position.add(this.direction);
  this.fade -= 5;
};

Floaties.prototype.display = function(){
  stroke(200,this.lifespan);
  strokeWeight(0.25);
  fill(255,204,255, 100);
  ellipse(this.position.x, this.position.y, 10, 10);
};

Floaties.prototype.isDead = function(){
  return this.fade < 0;
};

let System = function(position){
  this.origin = position.copy();
  this.particles = [];
};

System.prototype.addFloaties = function(){
  this.particles.push(new Floaties(createVector(mouseX,mouseY)));
};

System.prototype.run = function(){
  for(let i = this.particles.length-1; i >= 0; i--){
    let p = this.particles[i];
    p.run();
    if(p.isDead()){
      this.particles.splice(i,1);
    }
  }
};

function mouseClicked(){
  if(clicked){clicked = false;}
  else{clicked = true;}  
}

function drawTrees(){
  /*this took me a long time but it was very relaxing*/ 

  stroke(55,34,22); //brown
  
  //big tree in the front
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
  line(115,23,130,40);
  line(130,40,140,52);
  line(140,52,153,67);
  line(153,67,170,90);
  line(170,90,172,95);
  line(172,95,190,125);
  line(190,125,200,138);
  line(106,19,108,24);
  line(108,24,111,35);
  line(117,22,140,24);
  line(140,24,192,43);
  line(192,43,210,7);
  line(210,7,217,0);
  line(142,25,145,16);
  line(192,43,222,52);
  strokeWeight(1);
  line(217,120,218,133);
  line(111,35,123,50);
  line(123,50,135,65);
  line(135,65,142,72)
  line(142,72,152,86);
  line(152,86,165,95);
  line(135,65,127,79);
  line(127,79,127,90);
  line(145,16,173,0);

  //rightmost tree
  strokeWeight(3);
  line(327,271,333,260);
  line(333,260,334,252);
  line(334,252,330,235);
  line(334,252,327,246);
  line(327,246,329,238);
  line(336,270,334,251);
  
  strokeWeight(2);
  line(327,246,330,241);
  line(334,251,350,247);
  line(346,247,346,236);
  line(350,247,355,226);
  line(334,251,336,243);
  line(336,243,355,225);
  line(330,237,332,218);
  line(332,218, 335, 193); 
  line(332,218, 342,208 );
  line(342,208,340,184);
  line(330,222,317,215);
  line(317, 215,313,213);
  line(303,213,288,221);
  line(340,192,350,171);
  line(338,203,350,200);
  line(350,200,368,187);
  line(366,186,376,197);
  line(354,229,374,216);

  //thin tree to the left of the last one
  strokeWeight(2.5);
  line(290,276,288,252);
  strokeWeight(1);
  line(288,252,255,225);  
  line(288,252,265,215);  
  line(288,252,293,213);  
  line(288,252,310,221);  
  line(288,252,290,220);  

}
