
var initPack = {player:[],bullet:[]};
var removePack = {player:[],bullet:[]};

Entity = function(param){
  var self = {
    x: Math.random() * 1850 + 40,
    y: Math.random() * 810 + 100,
    spdX:0,
    spdY:0,
    id: "",
  }
if (param){
    if (param.x){
      self.x = param.x;
    }
    if (param.y){
      self.y = param.y;
    }
    if (param.id){
      self.id = param.id;
    }


}


self.update = function(){
    self.updatePosition();
  }
self.updatePosition = function(){
    self.x += self.spdX;
    self.y += self.spdY;
  }
self.getDistance = function(pt){
   return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
}
  return self;
}


Entity.getFrameUpdateData = function(){
  var pack = {
    initPack:{
    player:initPack.player,
    bullet:initPack.bullet,
    },
    removePack:{
      player:removePack.player,
      bullet:removePack.bullet,
    },
    updatePack:{
      player:Player.update(),
      bullet:Bullet.update(),
    }
};

  initPack.player = [];
  initPack.bullet = [];
  removePack.player = [];
  removePack.bullet = [];

  return pack;
}

///////////////
//Player class
///////////////////////////
Player = function(param){
  var self = Entity(param);
    self.username = param.username;
    self.number = "" + Math.floor(10 * Math.random());
    self.pressingRight =false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 12;
    self.hp = 100;
    self.hpMax = 100;
    self.score = 0;
    self.deaths = 0;
    self.gravity = .3;
    self.gravityspeed = 0;
    self.bounce = 0.1;
    self.jumping = false;
    self.spdY -= 1.5;
    self.checkCollisionRight = false;
    self.checkCollisionLeft = false;
    self.atk1Ready = true;
    self.atk2Ready = true;


    var super_update = self.update;

    self.update = function(){
        self.updateSpd();
        super_update();


        if (self.pressingAttack){
          self.shootBullet(self.mouseAngle);
        }

        if (self.pressingAttack2){
          self.aoeBullet(self.mouseAngle);
        }

      }







      self.shootBullet = function(angle){
          if (self.atk1Ready){

        var b =  Bullet(self.id, angle);
        b.x = self.x;
        b.y = self.y;
        }

      }

      self.aoeBullet = function(){

        if (self.atk2Ready){
          self.atk2Ready = false;
          for (var i=0; i<360; i++){
            var b =  Bullet(self.id, i);
            b.x = self.x;
            b.y = self.y;
            }
             setTimeout(function(){ self.atk2Ready = true; }, 3000);
          }

      }

      self.jump = function(){
        self.spdY =- 16;
        self.jumping = true;

      }

      self.isJumping = function(){

        //left and right of middle platform
        if ((self.x < 860) || (self.x > 1100))
        {
        if (self.y > 860){
          self.jumping = false
          self.spdY = 0;
        }
        else if (self.y <= 860){

            self.spdY += .4;
            self.jumping = true
          }
        }

        //middle platforms
        if ((self.x > 780) && (self.x < 1180))
        {
          if ((self.y > 595) && (self.y < 625)){
            self.jumping = false
            self.spdY = 0;
          }
          else if ((self.y > 210) && (self.y < 310)){
              self.jumping = false
              self.spdY = 0;
            }

          else if (self.y > 860){
            self.jumping = false
            self.spdY = 0;
          }
          else{
              self.spdY += .4;
              self.jumping = true
            }
        }

        //left platform
        if ((self.x > 0) && (self.x < 340))
        {
          if ((self.y > 390) && (self.y < 420)){
            self.jumping = false
            self.spdY = 0;
          }
          else if (self.y > 860){
            self.jumping = false
            self.spdY = 0;
          }
          else{
              self.spdY += .4;
              self.jumping = true
            }
        }

        //right platform
        if ((self.x > 1550) && (self.x < 1950))
        {
          if ((self.y > 385) && (self.y < 420)){
            self.jumping = false
            self.spdY = 0;
          }
          else if (self.y > 860){
            self.jumping = false
            self.spdY = 0;
          }
          else{
              self.spdY += .4;
              self.jumping = true
            }
        }


      }


    self.updateSpd = function(){


      //check if hitting midde platform
      if (self.y > 625)
    {
      //check collision from left side of platform
      if  ((self.x <= 950) && (self.x >= 860))
      {
        self.checkCollisionRight= true;
      }
      else
      {
        self.checkCollisionRight = false;
      }

      if  ((self.x <= 1110) && (self.x >= 1000))
      {
        self.checkCollisionLeft= true;
      }
      else
      {
        self.checkCollisionLeft = false;
      }


    }


      if ((self.pressingRight) && (self.x <= 1900) && (self.checkCollisionRight == false))
      {

          if (self.spdx <= self.maxSpd)
          {
            self.spdX +=.5 //self.maxSpd
          }
          else
          {
         self.spdX = self.maxSpd;
          }

       }


    else if((self.pressingLeft) && (self.x >= 50) && (self.checkCollisionLeft == false))
    {
      if (self.spdx >= -self.maxSpd)
        {
          self.spdX -= .5 //self.maxSpd
        }
      else {
        self.spdX = -self.maxSpd;
      }
    }

      else{
      self.spdX = 0;
    }



  if((self.pressingUp) && (self.y >= 105)){
      if (!self.jumping){
        self.jump();
      }
      else {
        self.isJumping();
      }
  }
    else
    self.isJumping();


}


self.getInitPack = function(){
  return {
  id:self.id,
  x:self.x,
  y:self.y,
  number:self.number,
  hp:self.hp = 100,
  hpMax:self.hpMax = 100,
  score:self.score = 0,
  deaths:self.deaths = 0,
 };
}

self.getUpdatePack = function(){
  return {
  id:self.id,
  x:self.x,
  y:self.y,
  hp:self.hp,
  score:self.score,
  deaths:self.deaths,

 };
}
    Player.list[self.id] = self;
    initPack.player.push(self.getInitPack());
    return self;
}


Player.list = {};

Player.onConnect = function(socket,username){
console.log("Player: " + " connected to the server!");

var player = Player({
username:username,
id:socket.id,
});

  socket.on('keyPress', function(data){
      if(data.inputId === 'left'){
        player.pressingLeft = data.state;}
      else if(data.inputId === 'right'){
        player.pressingRight = data.state;}
      else if(data.inputId === 'up'){
        player.pressingUp = data.state;}
      else if(data.inputId === 'down'){
          player.pressingDown = data.state;}
      else if(data.inputId === 'attack'){
          player.pressingAttack = data.state;}
      else if(data.inputId === 'mouseAngle'){
          player.mouseAngle = data.state;}
      else if(data.inputId === 'attack2'){
          player.pressingAttack2 = data.state;}
  });


  socket.on('sendMsgToServer', function(data){
     for(var i in SOCKET_LIST){
       SOCKET_LIST[i].emit('addToChat', player.username + ': ' + data);
     }
   });



   socket.on('sendPmToServer', function(data){
var recipientSocket = null;
for (var i in Player.list){
  if (Player.list[i].username === data.username){
      recipientSocket = SOCKET_LIST[i];
    }
  }

  if (recipientSocket === null){
    socket.emit('addToChat', 'the player ' + data.username + ' is not online');
  } else {
      recipientSocket.emit('addToChat','From ' + player.username + ':' + data.message);
      socket.emit('addToChat','To ' + data.username + ':' + data.message);
    }

    });


  socket.emit('init', {
    selfId:socket.id,
    player:Player.getAllInitPack(),
    bullet:Bullet.getAllInitPack(),
  })
}

Player.getAllInitPack = function(){
  var players = [];
  for (var i in Player.list){
    players.push(Player.list[i].getInitPack());
  }
  return players;

}


  Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
    console.log("Player: " + socket.id + " disconnected!");
    removePack.player.push(socket.id);

  }

  Player.update = function(){
    var pack = [];
    for (var i in Player.list){
      var player = Player.list[i];
      player.update();
      pack.push(player.getUpdatePack());
    }
    return pack;
  }


Bullet = function(parent, angle){
  var self = Entity();
  self.id = Math.random();
  self.spdX = Math.cos(angle/180*Math.PI)*45;
  self.spdY = Math.sin(angle/180*Math.PI)*45;
  self.parent = parent;

self.timer = 0;
self.toRemove = false;
var super_update = self.update;

self.update = function(){
  if (self.timer++ > 100)
    self.toRemove = true;
  super_update();

  for(var i in Player.list){
    var p = Player.list[i];
    if(self.getDistance(p) < 32 && self.parent !== p.id){
      //handle health and bullet collision
      p.hp -=1.5;
      var shooter = Player.list[self.parent];


        if(p.hp <=0){
          if (shooter){
              shooter.score += 1;
            }

          p.deaths += 1;
          p.hp = p.hpMax;
          p.x = Math.random() * 1300;
          p.y = Math.random() * 600;

      }

        self.toRemove = true;
      }
    }
  }

  self.getInitPack = function(){
    return {
    id:self.id,
    x:self.x,
    y:self.y,
   };
  }

  self.getUpdatePack = function(){
    return {
    id:self.id,
    x:self.x,
    y:self.y,
   };
  }

  Bullet.list[self.id] = self;
  initPack.bullet.push({
    id:self.id,
    x:self.x,
    y:self.y,
  });
  return self;
}
Bullet.list = {};

Bullet.update = function(){
  var pack = [];
  for (var i in Bullet.list){
    var bullet = Bullet.list[i];
    bullet.update();
    if(bullet.toRemove){
      delete Bullet.list[i];
      removePack.bullet.push(bullet.id);
    }else
    pack.push(bullet.getUpdatePack());
  }
  return pack;
}

Bullet.getAllInitPack = function(){
  var bullets = [];
  for (var i in Bullet.list){
    bullets.push(Bullet.list[i].getInitPack());
    return bullets;
  }

}
