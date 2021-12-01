// Allows object types to be mutated and string indexed
interface IndexType {
  [index: string]: any;
}

// User Type
export interface User extends IndexType {
  socketId: string;
  username?: string;
  role?: 'Black' | 'White' | 'Spectator';
}

// Socket Room Type
export interface Room extends IndexType {
  roomId: string;
  users: Array<User['socketId']>; // Typed this way incase type of User is modified in the future
  status: 'Ongoing' | 'Complete';
}
