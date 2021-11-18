import React, { useRef } from 'react';
import { Box, BoxProps } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Piece, Tile, DragLayer } from '../Components';
import { White, Tiles, BoardImg } from 'src/Assets/chess-images';

export const Board = () => {
  const boxRef = useRef<HTMLDivElement>();

  const containerProps: BoxProps['sx'] = {
    display: 'grid',
    aspectRatio: '1/1',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    maxHeight: '85vh',
    margin: 'auto',
    border: '26px solid black',
    borderImage: `url(${BoardImg}) 28`
  };

  const columnProps: BoxProps['sx'] = {
    display: 'flex',
    flexDirection: 'column'
  };

  const tileProps: BoxProps['sx'] = {
    textAlign: 'center',
    flex: 1
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DragLayer />
      <Box sx={containerProps} ref={boxRef}>
        {
          ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((column, columnIndex) => (
            <Box key={`column-${column}`} sx={columnProps}>
              {
                [8, 7, 6, 5, 4, 3, 2, 1].map((row) => {
                  const bg = columnIndex % 2 === 0
                    ? (row % 2 === 0 ? Tiles.White : Tiles.Black)
                    : (row % 2 === 0 ? Tiles.Black : Tiles.White);

                  return (
                    <Tile
                      sx={tileProps}
                      key={`tile-${column}${row}`}
                      style={{
                        position: 'relative',
                        backgroundImage: `url(${bg})`,
                      }}
                    >
                      <Piece type={`piece-${column}${row}`} image={White.Pawn} />
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
