import React from 'react';
import { Box, CircularProgress, CircularProgressProps } from '@mui/material';

interface ProgressProps extends CircularProgressProps {
  sx?: CircularProgressProps['sx'];
}

export const Progress = ({ sx, ...props }: ProgressProps) => {
  const baseSx = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...sx,
  };

  return (
    <Box sx={baseSx} {...props}>
      <CircularProgress />
    </Box>
  );
};
