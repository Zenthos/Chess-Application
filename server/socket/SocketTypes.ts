import { Server, Socket } from 'socket.io';
import { ChessEngine } from '../engine';

// Allows object types to be mutated and string indexed
interface IndexType {
  [index: string]: unknown;
}

interface Message {
  username: string;
  message: string;
}

// User Type
export interface User extends IndexType {
  socketId: string;
  username?: string;
  roomId?: string;
  role?: 'Black' | 'White' | 'Bot' | 'Spectator';
}

// Socket Room Type
export interface Room extends IndexType {
  roomId: string;
  users: string[];
  chatLogs: Message[];
  game: ChessEngine;
  type: 'Public' | 'Private';
  status: 'Waiting' | 'Ongoing' | 'Complete';
}

// The function parameters of a socket handler
export interface HandlerParams {
  io: Server;
  socket: Socket;
  users: Map<string, User>;
  rooms: Map<string, Room>;
}
