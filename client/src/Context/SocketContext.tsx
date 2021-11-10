import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const SocketContext = createContext<{
  socket: Socket
}>({
  socket: io()
});

export interface SocketContextType {
  children: React.ReactNode | React.ReactNode[];
}

const SocketContextProvider = ({ children }: SocketContextType) => {
  const socket = io();

  return (
    <SocketContext.Provider value={{ socket }}>
      { children }
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
