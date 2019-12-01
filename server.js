
const main = function() {

    // *****************************************
    // ************** Server Code **************
    // *****************************************
    const express = require('express');
    const path = require('path');
    const app = express();
    const http = require('http').createServer(app);
    const io = require('socket.io')(http);
    
    app.use('/static', express.static(path.join(__dirname, '/public')));
    
    app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
    });
    
    io.on('connection', function(socket){
        io.emit('chat message', "A User has Connected");

        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });

        socket.on('disconnect', function(){
            io.emit('chat message', "A User has Disconnected");
        });
    });
    
    http.listen(3000, function(){
        console.log('listening on *:3000');
    });    

    // *****************************************
    // *************** Chess Code **************
    // *****************************************
    var pieces = [];
    var currentPlayer = 'White';

    app.get('/currentPlayer', function(req, res){
        res.send(currentPlayer); 
    });

    io.on('connection', function(socket){
        socket.emit('Update Board', pieces);

        socket.on('Moved', function(pieceMoved) {
            currentPlayer = currentPlayer == 'White' ? 'Black' : 'White';
            pieces[pieceMoved.index].position.x = pieceMoved.position.x;
            pieces[pieceMoved.index].position.y = pieceMoved.position.y;
            io.emit('Update Board', pieces);
        });

        socket.on('Captured', function(pieceMoved, capturedPieceIndex) {
            currentPlayer = currentPlayer == 'White' ? 'Black' : 'White';
            pieces[pieceMoved.index].position.x = pieceMoved.position.x;
            pieces[pieceMoved.index].position.y = pieceMoved.position.y;
            pieces[capturedPieceIndex].captured = true;
            io.emit('Update Board', pieces);
        });
    });

    const initPieces = function() {
        let arr = [];
        ['Black', 'White'].forEach((color, index) => {
            arr.push(new Piece('Rook' , color, 0, index, 0, 7 * index));
            arr.push(new Piece('Knight', color, 1, index, 1, 7 * index));
            arr.push(new Piece('Bishop', color, 2, index, 2, 7 * index));
            arr.push(new Piece('Queen' , color, 3, index, 3, 7 * index));
            arr.push(new Piece('King' , color, 4, index, 4, 7 * index));
            arr.push(new Piece('Bishop', color, 2, index, 5, 7 * index));
            arr.push(new Piece('Knight', color, 1, index, 6, 7 * index));
            arr.push(new Piece('Rook'  , color, 0, index, 7, 7 * index));
            for (let i = 0; i < 8; i++) {
                if (index == 0)
                    arr.push(new Piece('Pawn', color, 5, index, i, 1));
                else 
                    arr.push(new Piece('Pawn', color, 5, index, i, 6));
            }
        })
        return arr;
    }

    pieces = initPieces();
}

class Piece {
    constructor(name, color, tx, ty, px, py) {
        this.pieceType = name;
        this.player = color;
        this.tile = {x: tx, y: ty, s: 56};
        this.position = {x: px, y: py};
        this.initial = {x: px, y: py};
        this.selected = false;
        this.captured = false;
        this.moveCount = 0;
    }
}

main();