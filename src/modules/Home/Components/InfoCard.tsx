import React from 'react';
import Link from 'next/link';
import { Image } from '@common';
import { Box, Grid, Button } from '@mui/material';

interface InfoCardProps {
  image: StaticImageData;
  title: string;
  link: string;
  linkText: string;
  description: string;
  flipped?: boolean;
  externalLink?: boolean;
}

export const InfoCard = ({ image, title, description, flipped, link, linkText }: InfoCardProps) => {
  return (
    <Grid container spacing={6} textAlign="center">
      {flipped && (
        <Grid item sm={6} xs={12}>
          <Image src={image} alt={title} sx={{ width: '100%', height: '100%' }} />
        </Grid>
      )}
      <Grid item sm={6} xs={12} display="grid">
        <Box margin="auto">
          <h1>{title}</h1>
          <p>{description}</p>
          <Link href={link}>
            <Button>{linkText}</Button>
          </Link>
        </Box>
      </Grid>
      {!flipped && (
        <Grid item sm={6} xs={12}>
          <Image src={image} alt={title} sx={{ width: '100%', height: '100%' }} />
        </Grid>
      )}
    </Grid>
  );
};
