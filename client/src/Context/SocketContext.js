import React, { createContext } from 'react';
import * as io from 'socket.io-client';

export const SocketContext = createContext();

export default ({ children }) => {
  const socket = io();

  return (
    <SocketContext.Provider value={{ socket }}>
      { children }
    </SocketContext.Provider>
  )
};