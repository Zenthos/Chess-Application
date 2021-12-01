import { HandlerParams } from '../Types';

export function registerChatHandlers({ io, socket, users, rooms }: HandlerParams) {
  // ------------------------------------------------------------------------------------------
  // ------------------------- Handler for when a user sends a message ------------------------
  // ------------------------------------------------------------------------------------------
  socket.on('chat:message', ({ message }) => {
    if (socket.rooms.size <= 0) return;

    const user = users.get(socket.id);
    if (!user) return;

    const room = rooms.get(user.roomId as string);
    if (!room) return;

    room.chatLogs.push({
      username: user.username as string,
      message,
    });

    // Broadcast to all clients within the room
    io.to(room.roomId).emit('chat:logs', room.chatLogs);
  });

  // ------------------------------------------------------------------------------------------
  // -------------------------- Handler for when a user requests logs -------------------------
  // ------------------------------------------------------------------------------------------
  socket.on('chat:retrieve', () => {
    if (socket.rooms.size <= 0) return;

    const user = users.get(socket.id);
    if (!user) return;

    const room = rooms.get(user.roomId as string);
    if (!room) return;

    // Broadcast to only the user requesting the logs
    socket.emit('chat:logs', room.chatLogs);
  });
}
