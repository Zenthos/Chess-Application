
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
        res.sendFile(path.join(__dirname, '/index.html'));
    });

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });    
    
    // *****************************************
    // *************** Chat Code ***************
    // *****************************************
    var people = {};

    io.on('connection', function(client){
        client.on('Send Message', function(msg){
            try {
                let clientRoomName = rooms[people[client.id].room].roomName;
                io.to(clientRoomName).emit('Emit Message', people[client.id], msg);
            } catch(err) {
                console.log('Attempted to send message to non-existent room');
            }
        });

        client.on('disconnect', function(){
            try {
                let clientRoom = rooms[people[client.id].room];
                let message = `[${people[client.id].side}] ${people[client.id].username} has left the room.`;
                io.to(clientRoom.roomName).emit('Update', message);
                var removeIndex = clientRoom.players.find((element, index) => {
                    if (element.ID == people[client.id].ID)
                        return index;
                });
                clientRoom.players.splice(removeIndex, 1);
                delete people[client.id]; 
                if (clientRoom.players.length == 0) {
                    console.log("Deleting Room...");
                    delete rooms[clientRoom.roomName];
                }
            } catch(err) {
                console.log('Attempted to delete room twice');
            }
        });
    });

    // *****************************************
    // *************** Chess Code **************
    // *****************************************
    const P = require('./pieces').module;
    var rooms = {};

    io.on('connection', function(client){
        client.on("Joined", function(username, room, side, callback) {
            people[client.id] = {ID: client.id, username, room, side};
            if (!rooms.hasOwnProperty(room) && (side == 'White' || side == 'Black')) {
                console.log("Room did not exist, creating...");
                rooms[room] = new ChessRoom(io, room, people[client.id]);
                rooms[room].initPieces(P);
                client.join(room);
            } else {
                let present = rooms[room].alreadyHas(username);
                // if (present.hasUser) return callback(false, "Username Already Used In Requested Room");
                if (present.hasBlack && side == 'Black') return callback(false, "Black Player Already In Requested Room");
                if (present.hasWhite && side == 'White') return callback(false, "White Player Already In Requested Room");
                console.log("Joining already created room...");
                rooms[room].players.push(people[client.id]);
                client.join(room);
            }
            client.emit('Update', `You have joined the room: '${room}', as ${side}`);
            io.to(room).emit('Update', `[${side}] ${username} has joined the room.`)
            return callback(true, undefined);
        });

        client.on('Start', function() {
            let clientRoom = rooms[people[client.id].room]
            clientRoom.canStart();
        });

        client.on('Can Start', function(callback) {
            let clientRoom = rooms[people[client.id].room];
            let result = clientRoom.canStart();
            callback(result);
        });

        client.on('Get Player', function(callback) {
            callback(rooms[people[client.id].room].currentPlayer);
        });

        client.on('Validate', function(clientPieces) {
            let clientRoom = rooms[people[client.id].room];
            let match = true;
            if (clientPieces.length != 0) {
                clientRoom.pieces.forEach((item, index) => {
                    if (JSON.stringify(item) !== JSON.stringify(clientRoom.pieces[index]))
                        match = false
                });
            } 

            if (!match || clientPieces.length == 0) {
                
            let clientColor = people[client.id].side;
                io.to(clientRoom.roomName).emit('Update Board', clientRoom.pieces, clientColor);
            }
        });

        client.on('Client Clicked', function(clickPosition) {
            let clientRoom = rooms[people[client.id].room];
            let clientColor = people[client.id].side;
            clientRoom.onClickEvent(clickPosition, people[client.id].side, clientRoom);
            io.to(clientRoom.roomName).emit('Update Board', clientRoom.pieces, clientColor);
        });
    });
}

class ChessRoom {
    constructor(io, room, creator) {
        this.currentPlayer = 'White';
        this.roomName = room;
        this.io = io;
        this.pieces = [];
        this.players = [creator]
        this.ready = false;
        this.pieceSelected = false;
        this.gameFinished = false;
    }

    switchColor = function() {
        this.currentPlayer = this.currentPlayer == 'White' ? 'Black' : 'White';
    }

    sendUpdate = function(message) {
        this.io.to(this.roomName).emit('Update', message);
    }

    checkMated = function(winner) {
        this.io.to(this.roomName).emit('Update', `${winner} has won!`);
        this.gameFinished = true;
    }

    staleMated = function() {
        this.io.to(this.roomName).emit('Update', `The game is a stalemate!`);
        this.gameFinished = true;
    }

    flippedPieces = function() {
        let newPieces = [];
        for (let piece of this.pieces) {
            let shallowObject = JSON.parse(JSON.stringify(piece));
            shallowObject.position.y = 7 - piece.position.y;
            newPieces.push(shallowObject)
        }
        return newPieces;
    }

    onClickEvent = function(clickPosition, clientPlayer, clientRoom) {
        if (this.gameFinished) return;

        let selectedPiece = {contains: false, index: NaN};
        this.pieces.forEach((item, index) => {
            if (item.selected) {
                selectedPiece.contains = true;
                selectedPiece.index = index;
            }
        });

        if (selectedPiece.contains) {
            this.pieces[selectedPiece.index].deselect();
            this.pieces[selectedPiece.index].moveOrCapture(this.pieces, clickPosition, clientRoom);
        } else {
            for (let piece of this.pieces) {
                if (!piece.captured && piece.positionEqual(clickPosition))
                    piece.select(this.currentPlayer, clientPlayer);
            }
        }
    }

    initPieces = function(P) {
        ['Black', 'White'].forEach((color, index) => {
            this.pieces.push(new P.Rook('Rook' , color, 0, index, 0, 7 * index));
            this.pieces.push(new P.Knight('Knight', color, 1, index, 1, 7 * index));
            this.pieces.push(new P.Bishop('Bishop', color, 2, index, 2, 7 * index));
            this.pieces.push(new P.Queen('Queen' , color, 3, index, 3, 7 * index));
            this.pieces.push(new P.King('King' , color, 4, index, 4, 7 * index));
            this.pieces.push(new P.Bishop('Bishop', color, 2, index, 5, 7 * index));
            this.pieces.push(new P.Knight('Knight', color, 1, index, 6, 7 * index));
            this.pieces.push(new P.Rook('Rook'  , color, 0, index, 7, 7 * index));
            for (let i = 0; i < 8; i++) {
                if (index == 0) 
                    this.pieces.push(new P.Pawn('Pawn', color, 5, index, i, 1));
                else 
                    this.pieces.push(new P.Pawn('Pawn', color, 5, index, i, 6));
            }
        })
    }

    alreadyHas = function(username) {
        let usernameCheck = false;
        let blackCheck = false;
        let whiteCheck = false;
        this.players.forEach(element => {
            if (element.username == username) usernameCheck = true;
            else if (element.side == 'Black') blackCheck = true;
            else if (element.side == 'White') whiteCheck = true;
        });

        return {hasUser: usernameCheck, hasBlack: blackCheck, hasWhite: whiteCheck};
    }

    canStart = function() {
        let blackPlayer, whitePlayer;
        this.players.forEach(element => {
            if (element.side == 'Black') blackPlayer = element;
            else if (element.side == 'White') whitePlayer = element;
        });

        if (blackPlayer !== undefined && whitePlayer !== undefined) return true;
        else return false;
    }
}

main();