import React from 'react';
import { Box, Grid, IconButton, Paper, Card, CardHeader, CardContent, Typography, Divider } from '@mui/material';
import { Add, Menu } from '@mui/icons-material';

export const ForumHub = () => {
  const categories = [
    {
      title: 'Announcements',
      content: 'Website announcements will go here',
    },
    {
      title: 'General',
      content: 'Anything that doesnt fall into the other categories go here',
    },
    {
      title: 'Discussions',
      content: 'Topics that can be thoroughly discussed',
    },
    {
      title: 'Support',
      content: 'Where people go for support',
    },
  ];

  const recent = [
    {
      title: 'Announcement',
      author: 'Alex',
      description: 'The first announcement',
    },
    {
      title: 'Pinned Topic',
      author: 'Alex',
      description: 'Important information',
    },
    {
      title: 'Re: Support',
      author: 'Alex',
      description: 'A support reply',
    },
    {
      title: 'Re: General',
      author: 'Alex',
      description: 'New message',
    },
    {
      title: 'Support',
      author: 'Alex',
      description: 'Request for help',
    },
  ];

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Forum Main Hub</Typography>
        <IconButton>
          <Menu />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        <Grid item sm={9} xs={12}>
          {categories.map(({ title, content }) => (
            <Card key={title} sx={{ mb: 4 }}>
              <CardHeader
                sx={{ pb: 0 }}
                title={
                  <React.Fragment>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h5">{title}</Typography>

                      <IconButton sx={{ m: 0, p: 0 }}>
                        <Add />
                      </IconButton>
                    </Box>
                    <Divider />
                  </React.Fragment>
                }
              />
              <CardContent sx={{ pt: 0 }}>{content}</CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item sm={3} xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Recent
            </Typography>
            <Divider />
            {recent.map(({ title, author, description }) => (
              <Box key={title} sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
                <Typography variant="caption" color="lightgray">
                  By: {author}
                </Typography>
                <Typography variant="body1">{description}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
