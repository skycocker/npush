//initialize
var express = require('express')
  , npush = express()
  , server = require('http').createServer(npush)
  , io = require('socket.io').listen(server)
  , fs = require('fs')
  
var secret = process.env.SECRET;
var sockets = {};
npush.use(express.bodyParser());

server.listen(process.env.PORT);
//

npush.post('/', function(req, res) {
  
  var remote_secret = req.param('secret');
  
  if(remote_secret == secret) {
    var eventName = req.param('event');
    var obj = req.param('obj');
    
    if( req.param('channel') ) {
      var channel = req.param('channel');
      io.sockets.in(channel).emit(eventName, obj);
    }
    else if( req.param('user') ) {
      var user = req.param('user');
      sockets[user].emit(eventName, obj);
    }
    
    res.send(200);
  }
  else {
    res.send(401);
  }
});

//socket.io
//This should happen only if Heroku detected
io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});
//

io.sockets.on('connection', function(socket) {
  socket.emit('connection', { status: 'connected! :)' } );
  socket.on('set id', function(data) {
    var id = data.id;
    sockets[id] = socket;
    sockets[id].emit('estabilished');
  });
  socket.on('join channel', function(data) {
    socket.join(data.channel);
  });
});
