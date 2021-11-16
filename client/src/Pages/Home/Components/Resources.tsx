import React from 'react';
import { Divider, Grid, Typography } from '@mui/material';

export const Resources = () => {
  const resourceList = [
    {
      key: 'Basics',
      title: 'Learn The Basics',
      description: 'Anyone can learn how to play chess. Use this site to build your foundation.'
    },
    {
      key: 'Support',
      title: 'World-Wide Support',
      description: 'Visit our forum or chatroom if you have a question. No questions are stupid.'
    },
    {
      key: 'Updated',
      title: 'Regularly Updated',
      description: 'All information on this site is consistently being improved upon and updated!'
    },
    {
      key: 'People',
      title: 'Made for All People',
      description: 'Play with your friends, watch live matches, and even practice playing against AI!'
    }
  ];

  return (
    <React.Fragment>
      <Typography variant="h3" textAlign="center">Resources</Typography>
      <Divider />
      <Grid container spacing={4} textAlign="center">
        {resourceList.map((resource) => (
          <Grid key={resource.key} item md={3} sm={6} xs={12}>
            <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
              {resource.title}
            </Typography>
            <Typography paragraph>
              {resource.description}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
};
