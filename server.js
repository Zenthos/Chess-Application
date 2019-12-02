
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
    
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/chess.html');
    });

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });    
    
    // *****************************************
    // *************** Chat Code ***************
    // *****************************************
    var people = {};

    io.on('connection', function(client){
        client.on("Joined", function(username, address) {
            people[client.id] = username;
            client.emit('Update', "You have connected to the server.");
            io.emit('Update', username + " has joined the server.")
        });

        client.on('Send Message', function(msg){
            io.emit('Emit Message', people[client.id], msg);
        });

        client.on('disconnect', function(){
            io.emit('Update', people[client.id] + " has left the server.");
            delete people[client.id];
        });
    });

    // *****************************************
    // *************** Chess Code **************
    // *****************************************
    var pieces = [];
    var currentPlayer = 'White';

    app.get('/currentPlayer', function(req, res){
        res.send(currentPlayer); 
    });

    io.on('connection', function(client){
        client.on('Validate', function(clientPieces) {
            let matches = true;
            pieces.forEach((item, index) => {
                let c1 = item.position.x != clientPieces[index].position.x;
                let c2 = item.position.y != clientPieces[index].position.y;
                let c3 = item.captured != clientPieces[index].captured;
                if (!c1 && !c2 && !c3) 
                    matches = false;
            });
            
            if (matches == false)
                client.emit('Update Board', pieces);
        });

        client.on('Moved', function(pieceMoved) {
            currentPlayer = currentPlayer == 'White' ? 'Black' : 'White';
            pieces[pieceMoved.index].position.x = pieceMoved.position.x;
            pieces[pieceMoved.index].position.y = pieceMoved.position.y;
            io.emit('Update Board', pieces);
        });

        client.on('Captured', function(pieceMoved, capturedPieceIndex) {
            currentPlayer = currentPlayer == 'White' ? 'Black' : 'White';
            pieces[pieceMoved.index].position.x = pieceMoved.position.x;
            pieces[pieceMoved.index].position.y = pieceMoved.position.y;
            pieces[capturedPieceIndex].captured = true;
            let capturedPiece = pieces[capturedPieceIndex]
            io.emit('Update', `${capturedPiece.player} ${capturedPiece.pieceType} Was Captured!`);
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