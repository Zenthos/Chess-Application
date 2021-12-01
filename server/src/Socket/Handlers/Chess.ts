import { HandlerParams } from '../Types';

export function registerChessHandlers({ io, socket, users, rooms }: HandlerParams) {
  // ------------------------------------------------------------------------------------------
  // ---------------------- Handler for when a user requests board state ----------------------
  // ------------------------------------------------------------------------------------------
  socket.on('chess:retrieve', () => {
    if (socket.rooms.size <= 0) return;

    const user = users.get(socket.id);
    if (!user) return;

    const room = rooms.get(user.roomId as string);
    if (!room) return;

    const boardState = room.game.convertToPieceArray();
    socket.emit('chess:board', boardState);
  });

  // ------------------------------------------------------------------------------------------
  // ----------------------- Handler for when a user updates board state ----------------------
  // ------------------------------------------------------------------------------------------
  socket.on('chess:update', ({ from, to }) => {
    console.log(`Chess Move Detected...\nFrom: ${from}\nTo: ${to}`);
  });
}
