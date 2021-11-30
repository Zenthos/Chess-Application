import React, { useContext, useEffect } from 'react';
import { Box, BoxProps } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Piece, Square, DragLayer } from '../Components';
import { Tiles, BoardImg } from 'src/Assets/chess-images';
import { GetPieceImage, ConversionMap } from 'src/Utils';
import { useAppDispatch, useAppSelector } from 'src/Redux';
import { SocketContext } from 'src/Contexts';
import { addBoardListeners, removeBoardListeners } from '../Engine';

export const Board = () => {
  const { pieces } = useAppSelector((state) => state.chess);
  const { socket } = useContext(SocketContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    addBoardListeners(socket, pieces, dispatch);
    return () => removeBoardListeners(socket);
  }, [socket, pieces, dispatch]);

  const containerStyles: BoxProps['sx'] = {
    display: 'grid',
    aspectRatio: '1/1',
    gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    maxHeight: '85vh',
    margin: 'auto',
    border: '26px solid black',
    borderImage: `url(${BoardImg}) 28`
  };

  const rowStyles: BoxProps['sx'] = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DragLayer />
      <Box sx={containerStyles}>
        {
          pieces.map((row, rowIndex) => (
            <Box key={`row-${rowIndex}`} sx={rowStyles}>
              {
                row.map((piece, tileIndex) => {
                  const bg = rowIndex % 2 === 0
                    ? (tileIndex % 2 === 0 ? Tiles.White : Tiles.Black)
                    : (tileIndex % 2 === 0 ? Tiles.Black : Tiles.White);

                  const position = `${ConversionMap(tileIndex + 1)}${rowIndex + 1}`;

                  return (
                    <Square key={`tile-${position}`} squarePos={position} color={bg}>
                      {
                        (piece !== '-') ? (
                          <Piece key={`piece-${position}`} pieceType={piece} piecePos={position} image={GetPieceImage(piece)} />
                        ) : null
                      }
                    </Square>
                  );
                })
              }
            </Box>
          ))
        }
      </Box>
    </DndProvider>
  );
};
