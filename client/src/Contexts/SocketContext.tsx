import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const SocketContext = createContext<{
  socket: null
}>({
  socket: null
});

export interface SocketContextType {
  children: React.ReactNode | React.ReactNode[];
}

const SocketContextProvider = ({ children }: SocketContextType) => {
  return (
    <SocketContext.Provider value={{ socket: null }}>
      { children }
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
