import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, CardMedia, Button } from '@mui/material';

interface InfoCardProps {
  image: string;
  title: string;
  link: string;
  linkText: string;
  description: string;
  flipped?: boolean;
  externalLink?: boolean;
}

export const InfoCard = ({ image, title, description, flipped, link, linkText, externalLink }: InfoCardProps) => {
  return (
    <Grid container spacing={6} textAlign="center">
      {flipped && (
        <Grid item sm={6} xs={12}>
          <CardMedia sx={{ maxHeight: 350 }} component="img" image={image} alt="" />
        </Grid>
      )}
      <Grid item sm={6} xs={12} display="grid">
        <Box margin="auto">
          <h1>{title}</h1>
          <p>{description}</p>
          {externalLink ? (
            <a href={link}>
              <Button>{linkText}</Button>
            </a>
          ) : (
            <Link to={link}>
              <Button>{linkText}</Button>
            </Link>
          )}
        </Box>
      </Grid>
      {!flipped && (
        <Grid item sm={6} xs={12}>
          <CardMedia sx={{ maxHeight: 350 }} component="img" image={image} alt="" />
        </Grid>
      )}
    </Grid>
  );
};
