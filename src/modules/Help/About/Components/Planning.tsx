import React from 'react';
import { Check, Close } from '@mui/icons-material';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';

export const FutureUpdates = () => {
  const updates = [
    {
      key: 1,
      Check,
      description: 'Refactored Page Routing',
    },
    {
      key: 2,
      Check,
      description: 'Refactored Home Page',
    },
    {
      key: 3,
      Check,
      description: 'Complete the About Page',
    },
    {
      key: 4,
      Check,
      description: 'Complete the Tutorial Page',
    },
    {
      key: 5,
      Close,
      description: 'Recreate Chess Engine',
    },
    {
      key: 6,
      Close,
      description: 'Create Chat Interface',
    },
    {
      key: 7,
      Close,
      description: 'Create Chess AI',
    },
    {
      key: 8,
      Close,
      description: 'Implement Login/Register System',
    },
    {
      key: 9,
      Close,
      description: 'Design and Implement User Profiles',
    },
    {
      key: 10,
      Close,
      description: 'Implement User Settings',
    },
    {
      key: 11,
      Close,
      description: 'Implement Friend System',
    },
    {
      key: 12,
      Close,
      description: 'Complete the Shop Page',
    },
    {
      key: 13,
      Close,
      description: 'Complete the Forum Directory',
    },
  ];

  return (
    <React.Fragment>
      <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
        Planned Updates
      </Typography>

      <List>
        {updates.map(({ key, description, Check, Close }, index) => (
          <ListItem
            key={`update-${key}`}
            sx={{
              m: 0,
              p: 0,
              borderTopLeftRadius: index === 0 ? 8 : 0,
              borderTopRightRadius: index === 0 ? 8 : 0,
              borderBottomLeftRadius: index === updates.length - 1 ? 8 : 0,
              borderBottomRightRadius: index === updates.length - 1 ? 8 : 0,
              bgcolor: (theme) => (Check ? theme.palette.success.main : theme.palette.error.main),
            }}
          >
            <ListItemIcon>
              {Check && <Check sx={{ margin: 'auto' }} />}
              {Close && <Close sx={{ margin: 'auto' }} />}
            </ListItemIcon>
            <ListItemText>{description}</ListItemText>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
};
