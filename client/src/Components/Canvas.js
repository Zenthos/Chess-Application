import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../Context/SocketContext';
import board from '../assets/chess-images/board.png';
import figures from '../assets/chess-images/figures.png';
import useImage from 'use-image';
import { Rect, Circle, Image } from 'react-konva';
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
  const [last, setLast] = useState({ from: '', to: '' });
  const [needToPromote, setNeedToPromote] = useState(false);
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
    const [isHovering, setIsHovering] = useState(false);
    const [position, setPosition] = useState({ x: calcPosition(data.position.charAt(0)), y: calcPosition(data.position.charAt(1), true) });

    const hoverStart = () => setIsHovering(true);
    const hoverEnd = () => setIsHovering(false);

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
      <Portal zIndex={(isDragging) ? 100:0}>
        {data.availableMoves && data.color === role ? data.availableMoves.map(([x, y], index) => {
          return (isDragging || isHovering) ? <Circle 
          key={index} 
          x={calcPosition(x) + 28}
          y={calcPosition(y, true) + 28}
          radius={6}
          shadowBlur={1}
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
        onMouseEnter={hoverStart}
        onMouseLeave={hoverEnd}
        draggable={role === data.color? true:false}
        />
      </Portal>
    )
  }

  // Initial Render
  useEffect(() => {
    socket.on('update', (pieces, title, last) => {
      setPieces(pieces);
      setMessage(title);
      setLast(last);
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

    socket.on('promotion', () => setNeedToPromote(true));
    socket.on('set client color', (server_role) => setRole(server_role));

    socket.emit('Get Game');
  }, [socket]);

  useEffect(() => {
    if (boardImg)
      setMaxSize(boardImg.width * 1.25);
    
  }, [boardImg]);

  const handlePromotion = (event) => {
    setNeedToPromote(false);
    socket.emit('Update Piece', event.target.value);
  }

  return (
    <div ref={ref} className="container-fluid d-flex flex-column col-sm-8 p-2" align="center">
      <h1 className="text-white text-bold" style={{ fontSize: 'calc(1.5vw + 1.5vh)' }}>{message}</h1>
      <div className="flex-grow-1">
        <Stage className={`${!ready || needToPromote ? 'block-content' : ''}`} width={Math.min(width, height, maxSize)} height={Math.min(width, height, maxSize)} scale={getScale()}>
          <Layer>

            <Image image={boardImg} />  
          
            {!ready ? null:pieces.map((value, index) => {
              return <Piece key={index} socket={socket} image={figureImg} data={value}/>
            })}

            {last.from === '' ? null:
            <Rect 
            x={calcPosition([' ','a','b','c','d','e','f','g','h'].findIndex((item) => item === last.from.charAt(0)))}
            y={calcPosition(last.from.charAt(1), true)}
            width={56}
            height={56}
            opacity={0.5}
            fill="brown"
            />
            }

            {last.from === '' ? null:
            <Rect 
            x={calcPosition([' ','a','b','c','d','e','f','g','h'].findIndex((item) => item === last.to.charAt(0)))}
            y={calcPosition(last.to.charAt(1), true)}
            width={56}
            height={56}
            opacity={0.7}
            fill="brown"
            />
            }

          </Layer>
        </Stage>
        <div className={ready ? 'd-none' : 'canvas-modal'}>
          <div className="modal-content">
            <h3 className="modal-title m-3">Waiting for a player to join as {missing}...</h3>
          </div>
        </div>
        <div className={needToPromote ? 'canvas-modal' : 'd-none'}>
          <div className="p-3 modal-content">
            <h5 className="modal-title mb-3">Choose a piece to upgrade the Pawn into</h5>
            <div className="row mx-0">
              <button className="col btn btn-primary" value="r" onClick={handlePromotion}>Rook</button>
              <button className="col btn btn-primary" value="n" onClick={handlePromotion}>Knight</button>
            </div>
            <div className="row mx-0">
              <button className="col btn btn-primary" value="b" onClick={handlePromotion}>Bishop</button>
              <button className="col btn btn-primary" value="q" onClick={handlePromotion}>Queen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Canvas;