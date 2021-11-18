import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';

interface PieceProps {
  type: string;
  image: string;
}

export const Piece = ({ type, image }: PieceProps) => {
  const imageComponent = <img src={image} alt={type} style={{ width: '95%' }} />;

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'piece',
    item: imageComponent,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
  }), []);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <React.Fragment>
      <Box
        ref={drag}
        sx={{
          opacity: isDragging ? 0 : 1,
          fontSize: 25,
          fontWeight: 'bold',
          cursor: 'move',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {imageComponent}
      </Box>
    </React.Fragment>
  );
};
