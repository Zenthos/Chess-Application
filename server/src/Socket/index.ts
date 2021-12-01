import * as Handlers from './Handlers';
import { ChessEngine } from '../Engine';
import { Room, User } from './Types';
import { Server } from 'socket.io';

// Initialize Socket Server handlers
export function initializeSocket(io: Server) {
  const users: Map<string, User> = new Map();
  const rooms: Map<string, Room> = new Map();

  io.on('connection', (socket) => {
    // Perform actions when a user connects
    users.set(socket.id, { socketId: socket.id });

    // Perform actions when a user disconnects
    socket.on('disconnect', () => {
      users.delete(socket.id);
      rooms.forEach(({ users }) => {
        if (users.includes(socket.id)) {
          const userIndex = users.indexOf(socket.id);

          users.splice(userIndex, 1);
        }
      });
    });

    // Register event listeners Handlers
    Handlers.registerRoomHandlers(io, socket, rooms);
    Handlers.registerChatHandlers(io, socket);
    Handlers.registerChessHandlers(io, socket);
  });
}
