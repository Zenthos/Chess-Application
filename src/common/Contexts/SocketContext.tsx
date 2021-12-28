import React, { useState, createContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
});

interface SocketProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<SocketContextType['socket']>(null);

  // useEffect(() => {
  //   const newSocket = io();
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
