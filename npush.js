//initialize
var express = require('express')
  , npush = express()
  , server = require('http').createServer(npush)
  , io = require('socket.io').listen(server)
  , fs = require('fs')
  
var sockets = {};
npush.use(express.bodyParser());

fs.existsSync("./config.json", function(exists) {
  if(exists) {
    var config = require('./config.json');
    var listen_port = config.listen_port;
  } else {
    var listen_port = process.env.listen_port;
  }
});

server.listen(listen_port);
//

npush.post('/', function(req, res) {
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
