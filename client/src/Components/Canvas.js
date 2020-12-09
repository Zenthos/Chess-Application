import React, { useRef, useState, useContext, useEffect } from 'react';
import withWindowDimensions from '../Service/WindowSizeService';
import { SocketContext } from '../Context/SocketContext';
import useImage from 'use-image';
import './ComponentCSS.css';

const Canvas = ({ role, windowWidth, windowHeight }) => {
  const canvasRef = useRef(null);
  const { socket } = useContext(SocketContext);
  const [boardImg] = useImage('/chess-images/board.png');
  const [figureImg] = useImage('/chess-images/figures.png');

  const [lastMove, setLastMove] = useState({});
  const [showPromotion, setShowPromotion] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [playerWaitingFor, setPlayerWaitingFor] = useState('');
  const [pieces, setPieces] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('White');

  const clickHandler = ({ nativeEvent }) => {
    const scale = ((windowWidth * 0.85) / 2) / boardImg.width;
    const sourceSide = 56;
    const side = sourceSide * scale;
    const xOffset = 28 * scale;
    const yOffset = 28 * scale;

    const { offsetX, offsetY } = nativeEvent;
    let x = Math.floor((offsetX - xOffset) / side);
    let y = Math.floor((offsetY - yOffset) / side);
    if (role === 'Black') {
      socket.emit('click', x, (7 - y));
      setLastMove({ x, y: (7 - y) });
    } else {
      socket.emit('click', x, y);
      setLastMove({ x, y });
    }
  }

  const handlePromotion = (event) => {
    setShowPromotion(false);
    socket.emit('click', lastMove.x, lastMove.y, event.target.value);
  }

  // Initial Render
  useEffect(() => {
    socket.on('update', (pieces, color) => {
      setPieces(pieces);
      setCurrentPlayer(color);
    });

    socket.on('wait', (ready, playerMissing) => {
      if (!ready) {
        setTimeout(() => {
          socket.emit('request update');
        }, 1000);

        setShowBoard(true);
        setPlayerWaitingFor(playerMissing);
      } else {
        setShowBoard(true);
        setPlayerWaitingFor('');
      }
    });

    socket.on('select a piece', () => {
      setShowPromotion(true);
    });

    socket.emit('request update');
  }, [socket])

  // Later Renders
  useEffect(() => {
    const drawPiece = (ctx, pieceData, xOffset, yOffset, side, sourceSide) => {
      var x, y;
      if (role === 'Black') {
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
      const scale = ((windowWidth * 0.85) / 2) / boardImg.width;
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

        if (role === 'Black')
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
            if (role === 'Black')
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

  }, [pieces, boardImg, figureImg, role, windowWidth, windowHeight]);

  return (
    <div align="center">
      <div className={`${showBoard ? '' : 'block-content'} ${showPromotion ? 'block-content' : ''}`}>
        <h1>It is {currentPlayer}'s Turn!</h1>
        <canvas className="m-2" ref={canvasRef} onClick={clickHandler} />
      </div>
      <div className={showBoard ? 'd-none' : 'canvas-modal'}>
        <div className="modal-content">
          <h3 className="modal-title m-3">Waiting for a player to join as {playerWaitingFor}...</h3>
        </div>
      </div>
      <div className={showPromotion ? 'canvas-modal' : 'd-none'}>
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

export default withWindowDimensions(Canvas);