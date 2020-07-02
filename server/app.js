(startServer = function() {
    const express = require('express');
    const path = require('path');
    const app = express();
    const http = require('http').createServer(app);
    const io = require('socket.io')(http);
    let port = process.env.PORT;
    
    if (port == null || port == "") {
        port = 3000;
    }

    app.use('/static', express.static(path.join(__dirname, '/../public')));

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '/../public/home/home.html'));
    });

    app.get('/chess', function(req, res) {
        res.sendFile(path.join(__dirname, '/../public/chess/chess.html'));
    });

    http.listen(port, function(){
        console.log(`listening on *:${port}`);
    });    

    let chatModule = require('./chat/chat.js');
    let chessModule = require('./chess/chess.js');
    let roomModule = require('./chess/rooms.js');
    let piecesModule = require('./chess/pieces.js').module;

    let people = {};
    let rooms = {};

    let chat = new chatModule();
    chat.start(io, rooms, people, { rooms: roomModule, pieces: piecesModule });

    let chessApp = new chessModule();
    chessApp.start(io, people, rooms);
})();