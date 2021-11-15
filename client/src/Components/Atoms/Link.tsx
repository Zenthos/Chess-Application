import React from 'react';
import { Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  to: string;
  underline?: boolean;
  children: string | React.ReactElement | React.ReactElement[];
}

export const Link = ({ to, underline, children, ...props }: LinkProps) => {
  return (
    <RouterLink to={to} style={{ textDecoration: 'none' }}>
      <Typography
        color="#4FBCFF"
        sx={{
          textDecoration: underline ? 'underline' : 'none',
          ':hover': {
            color: (theme) => theme.components?.MuiButton?.styleOverrides?.text as any
          }
        }}
      >
        {children}
      </Typography>
    </RouterLink>
  );
};
