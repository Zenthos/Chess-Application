import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  children: React.ReactNode | React.ReactNode[];
}

export const SocketContext = createContext<{
  socket: null
}>({
  socket: null
});

export const SocketProvider = ({ children }: SocketContextType) => {
  return (
    <SocketContext.Provider value={{ socket: null }}>
      { children }
    </SocketContext.Provider>
  );
};
