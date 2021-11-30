import { ChessEngine } from '../Engine';
import { Server } from 'socket.io';

// Allows object types to be mutated and string indexed
interface IndexType {
  [index: string]: string
}

// Initialize Socket Server handlers
export function initializeSocket(io: Server) {
  const users: IndexType = {};
  const rooms: IndexType = {};

  io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);

    const engine = new ChessEngine();
    engine.parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    socket.emit('setPieces', engine.convertToPieceArray());

    socket.on('disconnect', () => {
      console.log(`a user disconnected: ${socket.id}\n`);
    });
  });
}
