// http://socket.io/get-started/chat/
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = new Array();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/credits', function(req, res){
  res.sendFile(__dirname + '/credits.html');
});

io.on('connection', function(socket){
  var username = socket.handshake.query.user;
  if (username != null) {
    users.push(username);

    io.emit('admin message', username + " connected");
    io.emit('admin message', users + " are here");

    socket.on('disconnect', function(){
      console.log('user disconnected');
      users = users.filter(function(user) {
  			return (user.localeCompare(username) != 0);
  		});
      io.emit('admin message', username + " disconnected, " + users + " still here");
    });

    socket.on('chat message', function(msg){
      console.log('message:', msg.user, msg.text);
      io.emit('chat message', msg.user + " said " + msg.text);
    });
  };
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});
