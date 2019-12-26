
module.exports = class Chat {
    start = function(io, rooms, people, modules) {
        io.on('connection', function(client){
            people[client.id] = {ID: client.id};

            client.on('Send Message', function(msg){
                try {
                    let clientRoomName = rooms[people[client.id].room].roomName;
                    io.to(clientRoomName).emit('Emit Message', people[client.id], msg);
                } catch(err) {
                    console.log('Attempted to send message to non-existent room');
                }
            });

            client.on('Change Rooms', function() {
                let clientRoom = rooms[people[client.id].room];
                var removeIndex = clientRoom.players.findIndex(person => person.ID === client.id);
                if (clientRoom.players === undefined) return;
                clientRoom.players.splice(removeIndex, 1);

                client.leave(clientRoom.roomName);

                if (clientRoom.players.length == 0) delete rooms[clientRoom.roomName];

                if (people[client.id].hasOwnProperty('username')) delete people[client.id].username;
                if (people[client.id].hasOwnProperty('room')) delete people[client.id].room;
                if (people[client.id].hasOwnProperty('side')) delete people[client.id].side;
                if (people[client.id].hasOwnProperty('again')) delete people[client.id].again;

                client.emit('Reset Chat');
            });

            client.on("Joined", function(username, room, side, callback) {
                people[client.id].username = username;
                people[client.id].room = room;
                people[client.id].side = side;
                people[client.id].again = 'No Response';

                if (!rooms.hasOwnProperty(room) && (side == 'White' || side == 'Black')) {
                    rooms[room] = new modules.rooms(io, room, modules.pieces);
                    rooms[room].initPieces();
                    rooms[room].addPlayer(people[client.id]);
                    client.join(room);
                } else {
                    let present = rooms[room].alreadyHas(username);
                    if (present.hasUser) return callback(false, "Username Already Used In Requested Room");
                    if (present.hasBlack && side == 'Black') return callback(false, "Black Player Already In Requested Room");
                    if (present.hasWhite && side == 'White') return callback(false, "White Player Already In Requested Room");
                    rooms[room].addPlayer(people[client.id]);
                    client.join(room);
                }

                client.emit('Update', `You have joined the room: '${room}', as ${side}`);
                io.to(room).emit('Update', `[${side}] ${username} has joined the room.`);
                return callback(true, undefined);
            });

            client.on('disconnect', function(){
                try {
                    if (Object.entries(rooms).length === 0 && rooms.constructor === Object) return;
                    let clientRoom = rooms[people[client.id].room];
                    let message = `[${people[client.id].side}] ${people[client.id].username} has left the room.`;

                    var removeIndex = clientRoom.players.findIndex(person => person.ID === client.id);
                    if (clientRoom.players === undefined) return;
                    clientRoom.players.splice(removeIndex, 1);
                    delete people[client.id]; 

                    if (clientRoom.players.length == 0) delete rooms[clientRoom.roomName];

                    io.to(clientRoom.roomName).emit('Player Left');
                    io.to(clientRoom.roomName).emit('Update', message);
                } catch(err) {
                    console.log(err);
                }
            });
        });
    }
}