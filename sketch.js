//variaveis para estados de jogo
var JOGAR = 1;
var ENCERRAR = 0;
var estadoDeJogo = JOGAR;

//variaveis para o trex
var trex, trexCorrendo, trexColidiu;
    
//variáveis para o solo    
var chao, imagemdochao, chaoinvisivel;

//variaveis da nuvem
var nuvem, imagemdanuvem;

//pontuação
var pontuacao = 0;

//grupos
var grupoDeObstaculos, grupoDeNuvens;

//variaveis para as imagens de fim de jogo
var fimDeJogo, reiniciar, fimDeJogoIMG, reiniciarIMG;

//variaveis para armazenar o som
var somSalto , somCheckPoint, somMorte;

//pré-carrega as imagens usadas nas animações
function preload() {
  //animação do trex correndo
  trexCorrendo = loadAnimation ("img/trex1.png", "img/trex2.png", "img/trex3.png");
  
  //imagem trex colidiu
  trexColidiu = loadAnimation("img/trex_collided.png");
  
  //imagem usada no chão do game
  imagemdochao = loadImage("img/ground2.png");
  
  //imagem usada nas nuvens
  imagemdanuvem = loadImage("img/cloud.png");
  
  //imagens usadas nos obstáculos
  obstaculo1 = loadImage("img/obstacle1.png");
  obstaculo2 = loadImage("img/obstacle2.png");
  obstaculo3 = loadImage("img/obstacle3.png");
  obstaculo4 = loadImage("img/obstacle4.png");
  obstaculo5 = loadImage("img/obstacle5.png");
  obstaculo6 = loadImage("img/obstacle6.png");
  
  //imagens usadas no fim de jogo
  fimDeJogoIMG = loadImage("img/gameOver.png");
  reiniciarIMG = loadImage("img/restart.png");
  
  
  //carrega os sons do jogo
  somSalto = loadSound("sound/jump.mp3");
  somMorte = loadSound("sound/die.mp3");
  somCheckPoint = loadSound("sound/checkPoint.mp3");
}


//instancia e configura os objetos sprites
function setup(){
  
  //delimita o tamanho da tela
  createCanvas(windowWidth, windowHeight);
  
  //objeto sprite trex
  trex = createSprite (50,height-70 ,20,50);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("colidiu", trexColidiu);
  trex.scale= 0.5;
  trex.x=40;
  
  //objeto chão do game
  chao = createSprite(width/2,height-20,width,20);
  chao.addImage("chão", imagemdochao);
  chao.x = chao.width/2;
  
  
  //objeto chão invisivel
  chaoinvisivel = createSprite (width/2,height-10,width,10);
  chaoinvisivel.visible = false;
  
  //cria os limites da tela
  edges = createEdgeSprites();
  
  //cria grupos de objetos
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();
  
  //colisão
  trex.setCollider("circle",0,0,30);
  //trex.debug = true;
  
  //objetos fim de jogo
  fimDeJogo = createSprite(width/2,height/2.5);
  fimDeJogo.addImage(fimDeJogoIMG);
  
  reiniciar = createSprite(width/2,height/2);
  reiniciar.addImage(reiniciarIMG);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;
  
  //var mensagem = " Mensagenzinha aqui";
  //console.log (mensagem)
  
}



function draw(){
 //adiciona o fundo branco na tela 
 background("white");
  
  
  
 //usa o frameRate como metrica para pontuação do jogo
  //usa o metodo Math.round para arrendondar os numeros do frameRate
 text("Pontuação: " + pontuacao, width-100,50 );
 
  
  if(estadoDeJogo === JOGAR) {
    
     //aparece as imagens de fim de jogo 
          fimDeJogo.visible = false;
          reiniciar.visible = false;
    
     //faz o solo reg redir para dar a ideia de movimento do jogo
      //chao.velocityX = -4;
    
    
      chao.velocityX = -(4 + pontuacao/200);
      grupoDeObstaculos.setVelocityXEach(-(4 + pontuacao/200));
      //grupoDeNuvens.setVelocityXEach(-(2 + pontuacao/500));
    
    //atualizando a pontuação
    pontuacao = pontuacao + Math.round(frameRate()/60); 
    
    //condição que faz o solo resetar para o posição inicial e sempre esteja na tela, sendo sua posição x a metade do tamanho da imagem usada para o chão  
     if (chao.x <0) {
         chao.x = chao.width/2;
         } 
    
     //condição para o dino poder pular, apenas se apertar o espaço e estiver no chão  
     if(touches.length > 0 && trex.y > height- 100){
        trex.velocityY = -10;
        somSalto.play();
        touches = [];
        } 

        
  
  if(pontuacao>0 && pontuacao%200 === 0){
       		somCheckPoint.play() 
     	}
    
  //chama a função para gerar as nuvens do jogo
    gerarNuvens();
  
  //chama a função para gerar os obstáculos
    gerarObstaculos();
    
    if(grupoDeObstaculos.isTouching(trex)){
      estadoDeJogo = ENCERRAR;
      somMorte.play();
    }
    
//---------------------------fim IF estadoDeJogo === JOGAR
  } else if(estadoDeJogo === ENCERRAR){
    
          //aparece as imagens de fim de jogo 
          fimDeJogo.visible = true;
          reiniciar.visible = true;
          
          //parar o solo
          chao.velocityX = 0;
    
          //altera a animação do dino para MORRI X_X
          trex.changeAnimation("colidiu", trexColidiu);
    
          //seta um numero negativo ao tempo de vida dos objetos para que não desapareçam, ao chegar em 0
          grupoDeObstaculos.setLifetimeEach(-1);
          grupoDeNuvens.setLifetimeEach(-1);
          
          //seta velocidade 0 a cada objeto do grupo
          grupoDeObstaculos.setVelocityXEach(0);
          grupoDeNuvens.setVelocityXEach(0);
    
          if (mousePressedOver(reiniciar)) {
              console.log("reiniciar o jogo");
              reset();
          }
      
      if(touches.length>0 ) {      
          reset();
           touches = []
         }

          } //---------------FIM MODO JOGO ENCERRAR ----------------
  
  
  //adiciona a ideia da gravidade para trazer o dino de volta ao chão
    trex.velocityY = trex.velocityY + 0.5;
  
 

 //faz o trex colidir com o chão invisivel para que mantenha a ideia de que ele está andando NO chão e não VOANDO em cima do chão xD
 trex.collide(chaoinvisivel); 
  
  
  
  
 //chama a função que desenha os sprites na tela 
 drawSprites ();
  
  
}

//função que gera as nuvens
function gerarNuvens(){
  //se o resto da divisão do frame atual por 60 for igual a 0;       desenha a nuvem na tela
  if(frameCount % 60 === 0) {
    //cria sprite nuvem
    nuvem = createSprite(windowWidth,100,40,10);
    //adiciona a imagem carregada no preload
    nuvem.addImage(imagemdanuvem);
    //gera uma posição Y aleatória para a nuvem
    nuvem.y = Math.round(random(height-100,height-300));
    //diminui o tamanho da nuvem
    nuvem.scale = 0.4;
    //dá velocidade a nuvem
    nuvem.velocityX = -4;
    
    
    //atribuir tempo de duração à nuvem
    //600/5=120 , 600 = distancia e 5 velocidade 
    nuvem.lifetime = width-200;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adiciona cada nuvem ao grupo 
    grupoDeNuvens.add(nuvem);
  }

}

function gerarObstaculos(){
  if (frameCount % 100 ===0){
    var obstaculo = createSprite(windowWidth,height-30,10,40);
    //obstaculo.velocityX=-(3 + pontuacao/500);
   
    //switch case vai gerar obstaculos aleatorios 
    //cria uma variavel aleatoria para armazenar um numero aleatorio, e passa essa variável no switch, para entrar no caso aleatorio 
    
    var aleatorio = Math.round(random(1,6));
    switch(aleatorio){
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;  
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;  
              default: break;
    }
    
    //definir tamanho do objeto 
    obstaculo.scale=0.5;
    
    //atribui tempo de duração do obstaculo
    obstaculo.lifetime = width-200; 
    
    //adiciona cada obstaculo ao grupo
    grupoDeObstaculos.add(obstaculo);
    
    //ajustando a profundidade
    obstaculo.depth = reiniciar.depth;
    reiniciar.depth = reiniciar.depth +1;
  }
}

function reset(){
  estadoDeJogo = JOGAR;
  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  
  trex.changeAnimation("correndo", trexCorrendo);
  
  pontuacao = 0;
}
