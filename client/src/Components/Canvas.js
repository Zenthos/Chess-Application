import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../Context/SocketContext';
import board from '../assets/chess-images/board.png';
import figures from '../assets/chess-images/figures.png';
import useImage from 'use-image';
import { Circle, Text, Image } from 'react-konva';
import { Stage, Layer, Portal } from 'react-konva-portal'
import { useMeasure } from "react-use";
import '../styles/ComponentCSS.css';

const Canvas = () => {
  const { socket } = useContext(SocketContext);
  const [ref, { width, height }] = useMeasure();
  const [maxSize, setMaxSize] = useState(1000);
  
  const [boardImg] = useImage(board);
  const [figureImg] = useImage(figures);

  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState('');
  const [pieces, setPieces] = useState([]);
  const [message, setMessage] = useState('Waiting...');
  const [role, setRole] = useState('White');

  const getScale = () => {
    let scale = 1;
    if (boardImg) 
      scale = Math.min(Math.floor(width)/boardImg.width, 1.25);
  
    return { x: scale, y: scale };
  }

  const calcPosition = (tile, flag) => {
    let charMap = ['a','b','c','d','e','f','g','h'];
    if (charMap.includes(tile)) {
      tile = charMap.findIndex((value) => value === tile);
    } else {
      tile = parseInt(tile) - 1;
    }

    if (role === 'Black' && flag) {
      tile = 7 - tile;
    }

    return 28 + ( 56 * tile );
  }

  const calcTile = (offset) => Math.round((offset - 28) / 56);

  const Piece = ({ socket, image, data }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: calcPosition(data.position.charAt(0)), y: calcPosition(data.position.charAt(1), true) });

    const dragStart = () => {
      setIsDragging(true);
      setPosition({ x: 0, y: 0 });
    }

    const dragEnd = (event) => {
      setIsDragging(false);
      let tileX = calcTile(event.target.x()) + 1;
      let tileY = calcTile(event.target.y()) + 1;
      let charMap = ['a','b','c','d','e','f','g','h'];

      let newTile = `${charMap[tileX - 1]}${role === 'White'? tileY: 9 - tileY}`;
      
      if (data.availableMoves.includes(newTile)) {
        setPosition({ x: calcPosition(tileX), y: calcPosition(tileY) });
        socket.emit('Update Game', { from: data.position, to: newTile });
      } else 
        setPosition({ x: calcPosition(data.position.charAt(0)), y: calcPosition(data.position.charAt(1), true) });
    }

    const calcCrop = function(type, color) {
      let x = 0;
      switch(type.toLowerCase()) {
        case 'r': x = 0; break;
        case 'n': x = 56; break;
        case 'b': x = 56*2; break;
        case 'q': x = 56*3; break;
        case 'k': x = 56*4; break;
        default: x = 56*5; 
      }

      return { x, y: color === "White" ? 56:0, width: 56, height: 56 };
    }

    return (
      <Portal zIndex={isDragging? 100:0}>
        {data.availableMoves ? data.availableMoves.map(([x, y], index) => {
          return isDragging ? <Circle 
          key={index} 
          x={calcPosition(x) + 28}
          y={calcPosition(y, true) + 28}
          radius={6}
          fill={'black'}
          />:null
        }):null}

        <Image image={image} 
        x={position.x} y={position.y} width={56} height={56}
        crop={calcCrop(data.type, data.color)}
        scaleX={isDragging? 1.1 : 1}
        scaleY={isDragging? 1.1 : 1}
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        draggable={role === data.color? true:false}
        />
      </Portal>
    )
  }

  // Initial Render
  useEffect(() => {
    socket.on('update', (pieces, title) => {
      setPieces(pieces);
      setMessage(title);
    });

    socket.on('wait', (start, playerMissing) => {
      if (!start) {
        setTimeout(() => {
          socket.emit('Get Game');
        }, 1000);

        setReady(false);
        setMissing(playerMissing);
      } else {
        setReady(true);
        setMissing('');
      }
    });

    socket.on('set client color', (server_role) => setRole(server_role));

    socket.emit('Get Game');
  }, [socket]);

  useEffect(() => {
    if (boardImg)
      setMaxSize(boardImg.width * 1.25);
    
  }, [boardImg]);

  return (
    <div ref={ref} className="container-fluid d-flex flex-column col-sm-8 p-2" align="center">
      <h3>{message}</h3>
      <div className="flex-grow-1">
        <Stage className={`${ready ? '' : 'block-content'}`} width={Math.min(width, height, maxSize)} height={Math.min(width, height, maxSize)} scale={getScale()}>
          <Layer>

            <Image image={boardImg} />  
          
            {!ready ? null:pieces.map((value, index) => {
              return <Piece key={index} socket={socket} image={figureImg} data={value}/>
            })}
      
            <Text text={`${Math.floor(width)}, ${Math.floor(height)}`} />
          </Layer>
        </Stage>
        <div className={ready ? 'd-none' : 'canvas-modal'}>
          <div className="modal-content">
            <h3 className="modal-title m-3">Waiting for a player to join as {missing}...</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Canvas;