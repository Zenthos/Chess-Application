import React from 'react';
import { useDrop } from 'react-dnd';
import { Box, BoxProps } from '@mui/material';

interface TileProps extends BoxProps {
  children: string | React.ReactElement | React.ReactElement[];
}

const Overlay = ({ color }: { color: string }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      zIndex: 1,
      opacity: 0.25,
      backgroundColor: color,
    }}
  />
);

export const Tile = ({ children, ...props }: TileProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'piece',
    drop: () => console.log('test'),
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
  }), []);

  return (
    <Box {...props} ref={drop}>
      {children}
      {isOver && !canDrop && <Overlay color="red" />}
      {!isOver && canDrop && <Overlay color="yellow" />}
      {isOver && canDrop && <Overlay color="green" />}
    </Box>
  );
};
