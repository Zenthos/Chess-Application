import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Piece, Tile, DragLayer } from '../Components';
import { Tiles, BoardImg } from 'src/Assets/chess-images';
import { GetPieceImage, ConversionMap } from 'src/Utils';
import { useAppSelector } from 'src/Redux';

export const Board = () => {
  const { pieces } = useAppSelector((state) => state.chess);

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
                    <Tile key={`tile-${position}`} tilePos={position} color={bg}>
                      {
                        (piece !== '-') ? (
                          <Piece key={`piece-${position}`} pieceType={piece} piecePos={position} image={GetPieceImage(piece)} />
                        ) : null
                      }
                    </Tile>
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
