import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from 'src/Contexts/SocketContext';
import board from 'src/Assets/chess-images/board.png';
import figures from 'src/Assets/chess-images/figures.png';
import 'src/Styles/ComponentCSS.css';

const Canvas = () => {
  const { socket } = useContext(SocketContext);

  return (
    <div className="container-fluid d-flex flex-column col-sm-8 p-2" >
      <canvas />
    </div>
  );
};

export default Canvas;
