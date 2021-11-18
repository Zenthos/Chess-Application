import React from 'react';
import Mast from 'src/Assets/about.jpg';
import { Grid, Typography } from '@mui/material';
import { Jumbotron } from 'src/Components';
import { FutureUpdates } from './Components';

export const About = () => {
  return (
    <React.Fragment>
      <Jumbotron
        link=""
        linkText="Play Now! &#x2794;"
        title="Alex Nguyen"
        description={'Junior Software Engineer & Full-Stack Developer.'}
        image={Mast}
        hideLink
      />

      <Grid container spacing={6}>
        <Grid item sm={6} xs={12}>
          <FutureUpdates />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
            About this Application
          </Typography>
          <Typography paragraph>
            This Chess Application was built using the MERN (MongoDB, Express, React, Node.js) Full-Stack Framework.
            In addition, communication between the server and client is done through REST, while the chess engine itself
            runs using websockets, through the Socket.IO library.
          </Typography>
          <Typography paragraph>
            Criticisms and Issues are always welcome, as I am always looking to improve my programming.
          </Typography>
          <Typography paragraph>
            To the left is everything I plan to add to the website. I dont have a timeline, so each item will be added at some point
            in the future.
          </Typography>
        </Grid>
      </Grid>

    </React.Fragment>
  );
};
