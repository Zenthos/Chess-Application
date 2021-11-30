import React from 'react';
import { useDrop } from 'react-dnd';
import { Box, BoxProps } from '@mui/material';
import { useAppDispatch, movePiece, setDragging } from 'src/Redux';

interface SquareProps extends BoxProps {
  children?: React.ReactElement | null;
  squarePos: string;
  color: string;
}

const Overlay = ({ color }: { color: string }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      zIndex: 100,
      opacity: 0.25,
      backgroundColor: color,
    }}
  />
);

export const Square = ({ color, squarePos, children }: SquareProps) => {
  const dispatch = useAppDispatch();

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'piece',
    canDrop: () => true,
    drop: (item: any) => {
      if (item.piecePos === squarePos) return;

      dispatch(movePiece({ start: item.piecePos, to: squarePos }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [squarePos]);

  const squareStyles: BoxProps['sx'] = {
    backgroundImage: `url(${color})`,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    display: 'flex',
    flex: 1,
  };

  const childStyles: BoxProps['sx'] = {
    position: 'absolute',
    textAlign: 'center',
    display: 'table-cell',
    height: '100%',
    width: '100%',
    zIndex: 200,
    p: 0,
    m: 0,
  };

  return (
    <Box ref={drop} sx={squareStyles}>
      <Box sx={childStyles}>
        {children}
      </Box>
      {/* {isOver && !canDrop && <Overlay color="red" />}
      {!isOver && canDrop && <Overlay color="yellow" />}
      {isOver && canDrop && <Overlay color="green" />} */}
    </Box>
  );
};
