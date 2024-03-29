import React, { useEffect, useState } from 'react';
import { Box, keyframes } from '@mui/system';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useAppSelector, setDragging, setAnimation, useAppDispatch } from '@redux';
import { useDrag } from 'react-dnd';
import { Translate } from 'src/utils';
import Image from 'next/image';

interface PieceProps {
  image: StaticImageData;
  pieceType: string;
  piecePos: string;
}

export const Piece = ({ pieceType, piecePos, image }: PieceProps) => {
  const dispatch = useAppDispatch();
  const { pendingAnimation } = useAppSelector((state) => state.chess);
  const [keyframe, setKeyframe] = useState<string | null>(null);

  const imageComponent = <Image src={image} alt={piecePos} />;

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'piece',
      item: {
        piecePos,
        pieceType,
        imageComponent,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [pieceType, piecePos, image],
  );

  useEffect(() => {
    dispatch(setDragging(isDragging ? piecePos : null));

    preview(getEmptyImage(), {
      captureDraggingState: true,
    });
  }, [isDragging]);

  useEffect(() => {
    if (pendingAnimation && pendingAnimation.start === piecePos) {
      setKeyframe(keyframes`
        from {}
        to {
          transform: ${Translate(piecePos, pendingAnimation.to)};
        }
      `);
    } else {
      setKeyframe(null);
    }
  }, [pendingAnimation]);

  return (
    <React.Fragment>
      <Box
        ref={drag}
        onAnimationEnd={() => dispatch(setAnimation(null))}
        sx={{
          opacity: isDragging ? 0 : 1,
          fontSize: 25,
          fontWeight: 'bold',
          cursor: 'move',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: `${keyframe} 1s ease`,
        }}
      >
        {imageComponent}
      </Box>
    </React.Fragment>
  );
};
