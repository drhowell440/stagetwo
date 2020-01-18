
///////////////////////////////////////////////////
//This block is to get the server up and running///
///////////////////////////////////////////////////

require('./Entity');
require('./Database');

var http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static('./client'));




const server = http.createServer(app);

const io = socketio(server);

server.on('error', (err)=>{
  console.error('Server error:', err);
});

server.listen(process.env.PORT || 2000, () => {
  console.log('The Cubed Servers have initialized on port 2000');
});

SOCKET_LIST = {};
////////////////////////
/////End of Block///////
////////////////////////

/////////////////////////////////////////////////////////////
///This is where the socket connect to and from the client///
////////////////////////////////////////////////////////////

io.sockets.on('connection', function(socket){
  socket.id = Math.random(10);
  SOCKET_LIST[socket.id] = socket;

  socket.on('signIn', function(data){
    Database.isValidPassword(data,function(res){
      if(res){
        Player.onConnect(socket,data.username);
        socket.emit('signInResponse', {success:true});
      } else {
        socket.emit('signInResponse', {success:false});
      }
    });
  });

  socket.on('signUp', function(data){
    Database.isUsernameTaken(data,function(res){
      if(res){
        socket.emit('signUpResponse', {success:false});
      } else {
        Database.addUser(data, function(){
          socket.emit('signUpResponse', {success:true});
        });
      }
  });
});
  socket.on('disconnect', function(){
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);
  });



   socket.on('evalServer', function(data){
      var res = eval(data);
      socket.emit('evalAnswer', res);
    });

});



setInterval(function(){
var packs = Entity.getFrameUpdateData();
  for (var i in SOCKET_LIST){
    var socket = SOCKET_LIST[i];
    socket.emit('init',packs.initPack);
    socket.emit('update',packs.updatePack);
    socket.emit('remove',packs.removePack);
  }
},1000/25);
