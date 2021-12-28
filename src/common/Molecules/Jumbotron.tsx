import React from 'react';
import Link from 'next/link';
import { Paper, Box, Button, Typography } from '@mui/material';

interface JumbotronProps {
  image: StaticImageData;
  link: string;
  linkText: string;
  hideLink?: boolean;
  title: string;
  description: string;
}

export const Jumbotron = ({ image, title, description, link, linkText, hideLink }: JumbotronProps) => {
  return (
    <Paper
      sx={{
        my: 2,
        borderRadius: 2,
        minHeight: '600px',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${image.src})`,
      }}
    >
      <Box
        sx={{
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          borderRadius: 2,
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />
      <Box sx={{ position: 'relative', color: 'white', p: { xs: 3, sm: 6 } }}>
        <Typography component="h1" variant="h3" color="inherit" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="inherit" paragraph>
          {description}
        </Typography>
        {!hideLink && (
          <Link href={link} passHref>
            <Button>{linkText}</Button>
          </Link>
        )}
      </Box>
    </Paper>
  );
};
