import React from 'react';
import { Paper, PaperProps, Typography, Divider } from '@mui/material';

interface MessageProps {
  username: string;
  message: string;
  role: string;
}

export const Message = ({ username, message, role }: MessageProps) => {
  const itemStyles: PaperProps['sx'] = {
    mb: 1,
    p: 1,
  };

  return (
    <Paper key={`${username}-${message}`} sx={itemStyles}>
      <Typography variant="body1" color="lightgray">
        [{role}] {username}
      </Typography>
      <Divider sx={{ mt: 0 }} />
      <Typography variant="body2">
        {message}
      </Typography>
    </Paper>
  );
};
