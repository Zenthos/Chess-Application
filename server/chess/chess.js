
module.exports = class ChessGame {
    start = function(io, people, rooms) {
        io.on('connection', function(client){
            client.on('Play Again', function(response, callback) {
                let clientRoom = rooms[people[client.id].room];

                if (clientRoom.playAgain()) {
                    clientRoom.pieces.splice(0, clientRoom.pieces.length);
                    clientRoom.initPieces();
                    clientRoom.currentPlayer = 'White';
                    clientRoom.sendUpdate('New Match Started.');
                    io.to(clientRoom.roomName).emit('Update Board', clientRoom.pieces, clientRoom.currentPlayer);
                    setTimeout(() => { clientRoom.players.forEach((person) => person.again = 'No Response') }, 3000);
                    callback(true);
                } else if (clientRoom.players.some((item) => item.again === 'Declined')) {
                    callback('Rejected');
                } else {
                    clientRoom.players[clientRoom.players.findIndex((person) => person.ID === client.id)].again = response;
                    callback(false);
                }
            });

            client.on('Can Start', function(callback) {
                let clientRoom = rooms[people[client.id].room];
                let result = clientRoom.canStart();
                callback(result);
            });

            client.on('Get Rooms', function(callback) {
                let dataToSend = [];
                for (let room in rooms) {
                    let data = { name: null, white: 0, black: 0, spectators: 0 };
                    let present = rooms[room].alreadyHas(undefined);

                    data.name = rooms[room].roomName;
                    if (present.hasWhite) data.white = 1;
                    if (present.hasBlack) data.black = 1;
                    data.spectators = rooms[room].players.length - data.white - data.black;

                    dataToSend.push(data);
                }
                callback(dataToSend);
            });

            client.on('Get Player', function(callback) {
                callback(rooms[people[client.id].room].currentPlayer);
            });

            client.on('Validate', function(clientPieces) {
                let clientRoom = rooms[people[client.id].room];
                let match = true;
                if (clientPieces.length != 0) {
                    clientRoom.pieces.forEach((item, index) => {
                        if (JSON.stringify(item) !== JSON.stringify(clientRoom.pieces[index])) match = false
                    });
                } 

                if (!match || clientPieces.length == 0) {
                    io.to(clientRoom.roomName).emit('Update Board', clientRoom.pieces, clientRoom.currentPlayer);
                }
            });

            client.on('Player Validation', function(callback) {
                let clientRoom = rooms[people[client.id].room];
                let contains = clientRoom.alreadyHas(people[client.id].username);

                if (contains.hasBlack && contains.hasWhite) {
                    callback(true);
                } else {
                    callback(false);
                }
            });

            client.on('Client Clicked', function(clickPosition) {
                let clientRoom = rooms[people[client.id].room];
                let clientColor = people[client.id].side;
                clientRoom.onClickEvent(clickPosition, people[client.id].side, clientRoom, clientColor);
                io.to(clientRoom.roomName).emit('Update Board', clientRoom.pieces, clientRoom.currentPlayer);
            });
        });
    }
}