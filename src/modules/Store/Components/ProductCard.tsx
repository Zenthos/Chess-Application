import React from 'react';
import { Image } from '@common';
import { Paper, Button, Typography } from '@mui/material';

interface ProductCardProps {
  index: number;
}

export const ProductCard = ({ index }: ProductCardProps) => (
  <Paper sx={{ p: 2, m: 1 }}>
    <Image
      src={`https://picsum.photos/340/500?random=${index}`}
      alt="Sample product image"
      sx={{ width: '100%', height: '500px' }}
    />
    <Typography variant="h6" gutterBottom>
      Product Card {index + 1}
    </Typography>
    <Typography variant="body1" gutterBottom>
      $20.00
    </Typography>
    <Typography variant="body2" gutterBottom>
      Quisque id tellus risus. Vestibulum ornare non arcu at egestas. Vivamus sed ultrices nisl, viverra varius mi.
      Nulla quis enim cursus, aliquam odio tincidunt, auctor turpis.
    </Typography>
    <Button>Buy Now</Button>
  </Paper>
);
