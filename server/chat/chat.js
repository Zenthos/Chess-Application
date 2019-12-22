
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

            client.on("Joined", function(username, room, side, callback) {
                people[client.id].username = username;
                people[client.id].room = room;
                people[client.id].side = side;

                if (!rooms.hasOwnProperty(room) && (side == 'White' || side == 'Black')) {
                    rooms[room] = new modules.rooms(io, room);
                    rooms[room].initPieces(modules.pieces);
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
                    if (clientRoom.players.length == 0) delete rooms[clientRoom.roomName];
                    clientRoom.players.splice(removeIndex, 1);
                    delete people[client.id]; 

                    io.to(clientRoom.roomName).emit('Player Left');
                    io.to(clientRoom.roomName).emit('Update', message);
                } catch(err) {
                    console.log(err);
                }
            });
        });
    }
}