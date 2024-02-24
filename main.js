var PLAY = 1;
var END = 0;
var gameState = PLAY;

var T_rex, T_rex_running, T_rex_collided;
var ground, invisibleGround, ground_Image;
var clouds, cloudImage;
var obstacle;
var groupObstacle,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score;
var GameOver,restartImg;
var jumpSound, checkPointSound, dieSound;

function preload(){
  T_rex_running = loadAnimation("trex1.png", "trex2.png","trex3.png");
  T_rex_collided = loadAnimation("trex_collided.png")
  ground_Image = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png")
  GameOver = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")

  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")

  jumpSound = loadSound("jump.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
  dieSound = loadSound("die.mp3")
}

function setup() {
  Canvas = createCanvas(1100, 300);
  Canvas.center();

  //crear al T_rex
  T_rex = createSprite(60,225,20,50);
  T_rex.addAnimation("running",T_rex_running);
  T_rex.addAnimation("collided",T_rex_collided);
  T_rex.scale = 0.7;

  T_rex.setCollider("circle", 0, 0, T_rex.height/2.5)
  //T_rex.debug = true;
  
  
  //crear el suelo
  ground = createSprite(300,280,400,20);
  ground.addImage("groundImg",ground_Image);
  ground.x = ground.width/2;
  ground.velocityX = -4;

  gameOver = createSprite(550,130)
  gameOver.addImage(GameOver)
  gameOver.scale = 2.0;
  
  restart = createSprite(550,220)
  restart.addImage(restartImg)

  //crear el suelo invisible
  invisibleGround = createSprite(150,290,400,20);
  invisibleGround.visible = false;
 
  groupObstacle = createGroup();

  score = 0;
  score2 = 0;
}
  
function draw() {
  //establecer color de fondo
  background(180);

  //mostrar puntuacion
  text("Puntuacion: " + score, 15, 15)

    if(gameState == PLAY){

      text("Puntos Acumulados: " + score2, 15, 30)
      //ocultar sprite
      gameOver.visible = false;
      restart.visible = false;

    ground.velocityX = -4;

    if(score%100==0){
      checkPointSound.play();
    }

    //AUMENTAR PUNTUACION
    score += Math.round(getFrameRate()/60) 

    //salto_space =)
    if(keyDown(32) && T_rex.y >= 230){
      T_rex.velocityY = -10;
      jumpSound.play();
    }

      //la gravedad del T_rex
      T_rex.velocityY += 0.5;

        //APARECER LOS CACTUS
        spawnObstacles();

        //
    if (groupObstacle.isTouching(T_rex)){
      T_rex.changeAnimation("collided", T_rex_collided);
      gameState = END;
      //T_rex.remove();
      dieSound.play();
    }

  } else if(gameState == END){
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    T_rex.velocityY = 0;

    groupObstacle.setVelocityXEach(0);

    groupObstacle.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset()
    }
  }
  //continue.......

  //crear paredes 
  edges = createEdgeSprites();

  if(ground.x <0){
    ground.x = ground.width/2;
  }


 //para q no caiga el T_rex
 //T_rex.collide(edges[3]);
 T_rex.collide(invisibleGround);

  //APARECER NUBES
  spawnClouds();

  drawSprites();
}

function reset(){
  gameState = PLAY
  groupObstacle.destroyEach();

  T_rex.changeAnimation("running",T_rex_running);

  score2 = score2 + score

  score = 0;

}


function spawnObstacles(){
  if(frameCount % 100 == 0){
    var obstacles = createSprite(1050,245,50,80)
    obstacles.velocityX = -6 ;
    obstacles.setCollider("rectangle", 0, 0, obstacles.width, obstacles.height)
    //obstacles.debug = true;

    //GENERAR OBSTACULOS AL AZAR
    var rand = Math.round(random(1,6));

    obstacles.scale = 1.0;

    switch(rand) {
      case 1: obstacles.addImage(obstacle1);
              break;
      case 2: obstacles.addImage(obstacle2);
              break;
      case 3: obstacles.addImage(obstacle3);
              break;
      case 4: obstacles.addImage(obstacle4);
              break;
      case 5: obstacles.addImage(obstacle5);
              break;
      case 6: obstacles.addImage(obstacle6)
              obstacles.scale = 0.7;
      default: break;

    }

    //asignar escala y ciclo de vida
    obstacles.lifetime = 190;

    groupObstacle.add(obstacles);

  }
}

function spawnClouds(){
  if(frameCount % 80 == 0){
    clouds = createSprite(1050,150,40,10);
    clouds.addImage(cloudImage);
    clouds.y = Math.round(random(40,100));
    clouds.velocityX = -3;
  
    //asignar tiempo de vida :)
    clouds.lifetime = 340;

      //AJUSTAR LA PROFUNDIDAD
    clouds.depth = T_rex.depth;
    T_rex.depth = T_rex.depth +1
  //console.log(clouds.depth);
  }

  //console.log(frameCount);
}