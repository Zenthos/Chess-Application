import React, { useRef, useState, useContext, useEffect } from 'react';
import { SocketContext } from '../Context/SocketContext';
import board from '../assets/chess-images/board.png';
import figures from '../assets/chess-images/figures.png';
import useImage from 'use-image';
import '../styles/ComponentCSS.css';

const getScale = (windowWidth, imageWidth) => {
  let scale = ((windowWidth * 0.85) / 2) / imageWidth;

  if (scale > 0.60) 
    return scale;
  else
    return 0.60;
}

const Canvas = ({ windowWidth }) => {
  const canvasRef = useRef(null);
  const { socket } = useContext(SocketContext);

  const [boardImg] = useImage(board);
  const [figureImg] = useImage(figures);

  const [gameReady, setGameReady] = useState(false);
  const [clientColor, setClientColor] = useState('White');
  const [pieces, setPieces] = useState([]);
  const [lastMove, setLastMove] = useState({});
  const [needToPromote, setNeedToPromote] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState('White');
  const [aKingIsInCheck, setAKingIsInCheck] = useState({ inCheck: false, color: "None" });

  const handleClick = ({ nativeEvent }) => {
    const scale = getScale(windowWidth, boardImg.width);
    const sourceSide = 56;
    const side = sourceSide * scale;
    const xOffset = 28 * scale;
    const yOffset = 28 * scale;

    const { offsetX, offsetY } = nativeEvent;
    let x = Math.floor((offsetX - xOffset) / side);
    let y = Math.floor((offsetY - yOffset) / side);
    if (clientColor === 'Black') {
      socket.emit('Update Game', x, (7 - y));
      setLastMove({ x, y: (7 - y) });
    } else {
      socket.emit('Update Game', x, y);
      setLastMove({ x, y });
    }
  }

  const handlePromotion = (event) => {
    setNeedToPromote(false);
    socket.emit('Update Game', lastMove.x, lastMove.y, event.target.value);
  }
  // Initial Render
  useEffect(() => {
    socket.on('update', (pieces, color, kingState) => {
      setPieces(pieces);
      setCurrentPlayer(color);
      setAKingIsInCheck(kingState);
    });

    socket.on('wait', (ready, playerMissing) => {
      if (!ready) {
        setTimeout(() => {
          socket.emit('Get Game');
        }, 1000);

        setGameReady(false);
        setWaitingForOpponent(playerMissing);
      } else {
        setGameReady(true);
        setWaitingForOpponent('');
      }
    });

    socket.on('set client color', (role) => setClientColor(role));
    socket.on('set need to promote', () => setNeedToPromote(true));

    socket.emit('Get Game');
  }, [socket]);

    // Later Renders
    useEffect(() => {
      const drawPiece = (ctx, pieceData, xOffset, yOffset, side, sourceSide) => {
        var x, y;
        if (clientColor === 'Black') {
          x = xOffset + (side * pieceData.x);
          y = yOffset + (side * (7 - pieceData.y));
        } else {
          x = xOffset + (side * pieceData.x);
          y = yOffset + (side * pieceData.y);
        }
  
        const tileOffset = pieceID[pieceData.pieceType] * sourceSide;
  
        if (pieceData.player === 'White')
          ctx.drawImage(figureImg, tileOffset, sourceSide, sourceSide, sourceSide, x, y, side, side);
        else
          ctx.drawImage(figureImg, tileOffset, 0, sourceSide, sourceSide, x, y, side, side);
      }
  
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const pieceID = {
        "Rook": 0,
        "Knight": 1,
        "Bishop": 2,
        "Queen": 3,
        "King": 4,
        "Pawn": 5
      }
  
      if (pieces.length !== 0 && boardImg !== undefined && figureImg !== undefined) {
        const scale = getScale(windowWidth, boardImg.width);
        const sourceSide = 56;
        const side = sourceSide * scale;
        const xOffset = 28 * scale;
        const yOffset = 28 * scale;
  
        let selectedPiece;
        canvas.width = boardImg.width * scale;
        canvas.height = boardImg.height * scale;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);

        for (let piece of pieces) {
          drawPiece(ctx, piece, xOffset, yOffset, side, sourceSide);
          if (piece.selected)
            selectedPiece = piece;
        }
  
        if (selectedPiece) {
          var x = xOffset + (side * selectedPiece.x);
          var y;
  
          if (clientColor === 'Black')
            y = yOffset + (side * (7 - selectedPiece.y));
          else
            y = yOffset + (side * selectedPiece.y);
  
          ctx.lineWidth = `${6 * scale}`;
          ctx.strokeStyle = "#39ff14";
          ctx.rect(x, y, side, side);
          ctx.stroke();
          if (selectedPiece.availableTiles.length > 0) {
            for (let possibleTile of selectedPiece.availableTiles) {
              let possibleX = xOffset + side / 2 + (side * possibleTile[0]);
              let possibleY;
              if (clientColor === 'Black')
                possibleY = yOffset + side / 2 + (side * (7 - possibleTile[1]));
              else
                possibleY = yOffset + side / 2 + (side * possibleTile[1]);
  
              ctx.beginPath();
              ctx.arc(possibleX, possibleY, 6 * scale, 0, 2 * Math.PI);
              ctx.fillStyle = 'black';
              ctx.fill();
            }
          }
        }
      }
  
    }, [pieces, boardImg, figureImg, clientColor, windowWidth]);

  return (
    <div className="col-sm-8 p-2" align="center">
      <div className={`${gameReady ? '' : 'block-content'} ${needToPromote ? 'block-content' : ''}`}>
        <h1>{(aKingIsInCheck ? aKingIsInCheck.inCheck : false) ? `${aKingIsInCheck.color} King is in Check. `: ``}It is {currentPlayer}'s Turn!</h1>
        <canvas className="m-2" ref={canvasRef} onClick={handleClick} />
      </div>

      {/*Popup Modals*/}
      <div className={gameReady ? 'd-none' : 'canvas-modal'}>
        <div className="modal-content">
          <h3 className="modal-title m-3">Waiting for a player to join as {waitingForOpponent}...</h3>
        </div>
      </div>
      <div className={needToPromote ? 'canvas-modal' : 'd-none'}>
        <div className="p-3 modal-content">
          <h5 className="modal-title mb-3">Choose a piece to upgrade the Pawn into</h5>
          <div className="row mx-0">
            <button className="col btn btn-primary" value="Rook" onClick={handlePromotion}>Rook</button>
            <button className="col btn btn-primary" value="Knight" onClick={handlePromotion}>Knight</button>
          </div>
          <div className="row mx-0">
            <button className="col btn btn-primary" value="Bishop" onClick={handlePromotion}>Bishop</button>
            <button className="col btn btn-primary" value="Queen" onClick={handlePromotion}>Queen</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Canvas;