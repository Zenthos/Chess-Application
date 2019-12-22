
module.exports = class ChessGame {
    start = function(io, people, rooms) {
        io.on('connection', function(client){
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