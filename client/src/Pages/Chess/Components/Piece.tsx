import React, { useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';

interface PieceProps {
  type: string;
  image?: string;
  children: string | React.ReactElement | React.ReactElement[];
}

export const Piece = ({ type, image = '5', children }: PieceProps) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'piece',
    item: { type, image },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
  }), []);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <React.Fragment>
      <div
        ref={drag}
        style={{
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
        {children}
      </div>
    </React.Fragment>
  );
};
