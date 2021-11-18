import React, { useRef } from 'react';
import { Box, BoxProps } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Piece, Tile } from '../Components';
import { DragLayer } from './DragLayer';

interface EngineProps {
  fen?: string;
}

export const Engine = () => {
  const boxRef = useRef<HTMLDivElement>();

  const containerProps: BoxProps['sx'] = {
    display: 'grid',
    aspectRatio: '1/1',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    maxHeight: '85vh',
    margin: 'auto',
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
                [8, 7, 6, 5, 4, 3, 2, 1].map((row) => (
                  <Tile
                    sx={tileProps}
                    key={`tile-${column}${row}`}
                    style={{
                      position: 'relative',
                      backgroundColor: columnIndex % 2 === 0
                        ? (row % 2 === 0 ? '#f0d9b5' : '#b58863')
                        : (row % 2 === 0 ? '#b58863' : '#f0d9b5')
                    }}
                  >
                    <Piece type={`piece-${column}${row}`}>
                      {`${column}${row}`}
                    </Piece>
                  </Tile>
                ))
              }
            </Box>
          ))
        }
      </Box>
    </DndProvider>
  );
};
