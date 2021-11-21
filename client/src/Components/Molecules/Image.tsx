import React, { useState } from 'react';
import { CardMedia, BoxProps } from '@mui/material';
import { Progress } from '../Atoms';

interface ImageProps {
  src: string;
  alt: string;
  sx: BoxProps['sx'];
}

export const Image = ({ src, alt, sx }: ImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const onImageLoaded = () => setLoaded(true);

  return (
    <React.Fragment>
      <Progress
        sx={{
          display: loaded ? 'none' : 'flex',
          minHeight: 494
        }}
      />
      <CardMedia
        onLoad={onImageLoaded}
        component="img"
        image={src}
        alt={alt}
        sx={{
          ...sx,
          display: loaded ? 'block' : 'none',
        }}
      />
    </React.Fragment>
  );
};
