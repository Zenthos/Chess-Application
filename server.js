const express = require('express');
const path = require('path');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/static', express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    io.emit('chat message', "A User has Connected");

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('piece captured', function(piece) {
        console.log(`${piece.player} ${piece.pieceType}, was captured!`);
    });

    socket.on('player moved', function(piece) {
        console.log(`${piece.player} ${piece.pieceType}, has moved!`);
    });

    socket.on('disconnect', function(){
        io.emit('chat message', "A User has Disconnected");
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
