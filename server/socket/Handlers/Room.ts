import { HandlerParams } from '../SocketTypes';
import { ChessEngine } from '../../engine';


export function registerRoomHandlers({ socket, users, rooms }: HandlerParams) {
  // ------------------------------------------------------------------------------------------
  // ------------------------- Handler for a request to list all rooms ------------------------
  // ------------------------------------------------------------------------------------------
  socket.on('rooms:retrieve', () => {
    const parsedRooms = [];

    for (const [roomId, room] of rooms) {
      const roomData = {
        status: 'Waiting',
        blackPresent: false,
        whitePresent: false,
        playerCount: room.users.length,
        spectatorCount: 0,
        roomName: roomId,
      };

      for (const userId of room.users) {
        const user = users.get(userId);
        if (!user) continue;

        if (user.role === 'Black') roomData.blackPresent = true;
        if (user.role === 'White') roomData.whitePresent = true;
      }

      roomData.spectatorCount = (roomData.playerCount) - (+roomData.blackPresent) - (+roomData.whitePresent);
      parsedRooms.push(roomData);
    }

    socket.emit('rooms:retrieved', parsedRooms);
  });

  // ------------------------------------------------------------------------------------------
  // -------------------------- Handler for a request to join a room --------------------------
  // ------------------------------------------------------------------------------------------
  socket.on('rooms:join', ({ roomName, roomType, username, role, playAgainstBot }) => {
    const room = rooms.get(roomName);

    if (room) {
      // Add the new user to the room
      room.users.push(socket.id);

      room.chatLogs.push({
        username: 'SYSTEM',
        message: `${username}, has joined the room!`,
      });

      // Determine if a black and white player exist in the room
      let black = false, white = false, bot = false;

      for (const [socketId, user] of users) {
        if (user.role === 'Black') black = true;
        if (user.role === 'White') white = true;
        if (user.role === 'Bot') bot = true;

        if ((black || bot) && (white || bot)) break;
      }

      // Set the room status to ongoing if a black and white player exist
      if ((black || bot) && (white || bot)) room.status = 'Ongoing';
    } else {
      // Create the room if it doesn't exist
      rooms.set(roomName, {
        type: roomType,
        roomId: roomName,
        status: 'Waiting',
        users: [socket.id],
        game: new ChessEngine(),
        chatLogs: [{
          username: 'SYSTEM',
          message: `${username}, has joined the room!`,
        }],
      });

      const room = rooms.get('roomName');
      if (room && playAgainstBot) {
        room.game.initialize();
        room.users.push('AI-BOT');
        room.status = 'Ongoing';
      }
    }

    const user = users.get(socket.id);
    if (!user) return;

    // Update User Information
    users.set(socket.id, {
      socketId: socket.id,
      username,
      role,
    });

    // Join room after everything has been updated
    socket.join(roomName);
    socket.emit('rooms:joined', rooms.get(roomName));
  });
}
