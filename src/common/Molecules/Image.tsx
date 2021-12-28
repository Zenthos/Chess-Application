import React, { useState } from 'react';
import NextImage from 'next/image';
import { CardMedia, BoxProps } from '@mui/material';
import { Progress } from '../Atoms';

interface ImageProps {
  src: StaticImageData | string;
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
          minHeight: 494,
        }}
      />
      <CardMedia sx={{ ...sx, display: loaded ? 'block' : 'none' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <NextImage src={src} alt={alt} onLoad={onImageLoaded} layout="fill" objectFit="contain" />
        </div>
      </CardMedia>
    </React.Fragment>
  );
};
