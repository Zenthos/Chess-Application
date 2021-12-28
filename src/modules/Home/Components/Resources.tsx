import React from 'react';
import { LibraryBooks, Phone, Update, Group } from '@mui/icons-material';
import { Divider, Grid, Icon, Typography } from '@mui/material';

export const Resources = () => {
  const resourceList = [
    {
      Icon: LibraryBooks,
      key: 'Basics',
      title: 'Learn The Basics',
      description: 'Anyone can learn how to play chess. We have many tools to develop your chess skills.',
    },
    {
      Icon: Phone,
      key: 'Support',
      title: 'World-Wide Support',
      description: 'Visit our forum or chatroom if you have any questions. Our community will gladly answer.',
    },
    {
      Icon: Update,
      key: 'Updated',
      title: 'Regularly Updated',
      description: 'All information on this site is consistently being improved upon and updated!',
    },
    {
      Icon: Group,
      key: 'People',
      title: 'Made for All People',
      description: 'Play with your friends, watch live matches, and even practice playing against an AI!',
    },
  ];

  return (
    <React.Fragment>
      <Typography variant="h3" textAlign="center">
        Resources
      </Typography>
      <Divider />
      <Grid container spacing={4} textAlign="center">
        {resourceList.map((resource) => (
          <Grid key={resource.key} item md={3} sm={6} xs={12}>
            <Icon sx={{ width: '100%', height: '140px' }}>
              <resource.Icon sx={{ width: '100%', height: '100%' }} />
            </Icon>
            <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
              {resource.title}
            </Typography>
            <Typography paragraph>{resource.description}</Typography>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
};
