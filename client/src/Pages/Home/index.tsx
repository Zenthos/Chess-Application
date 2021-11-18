import React from 'react';
import Chess from 'src/Assets/chess.jpg';
import Source from 'src/Assets/source.jpg';
import Person from 'src/Assets/person.jpg';
import JumboImage from 'src/Assets/header.jpg';
import { Divider, Alert, useTheme, useMediaQuery } from '@mui/material';
import { InfoCard, Resources } from './Components';
import { Jumbotron } from 'src/Components';

export const Home = () => {
  const theme = useTheme();
  const screenIsSmall = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <React.Fragment>
      <Alert variant="filled" severity="info" sx={{ py: 2 }}>
        This site is currently undergoing a major revision, please check back later when it is completed.
      </Alert>

      <Jumbotron
        link="/play"
        linkText="Play Now! &#x2794;"
        title="Chess"
        description="Welcome! Click below to begin playing chess."
        image={JumboImage}
      />

      <Resources />
      <Divider />
      <InfoCard
        link="/how-to-play"
        linkText="Learn the Rules!"
        title="Don't know how to play?"
        description="Click the Button below to learn the basic and advanced moves of chess,
          and to begin your chess journey."
        image={Chess}
      />
      <Divider />
      <InfoCard
        link="/about"
        linkText="Find out about the Creator!"
        title="Who made this website?"
        description="Click the Button below to check out the person who created this website,
          planned future updates, and some other projects created by the same author."
        flipped={screenIsSmall}
        image={Person}
      />
      <Divider />
      <InfoCard
        link="https://github.com/Zenthos/Chess-Application"
        linkText="Link to Repository"
        title="See the Source Code!"
        description="Click the Button below to check out the code that went into my website.
          Please submit an issue if you see something wrong with either the website, or my code."
        image={Source}
        externalLink
      />
    </React.Fragment>
  );
};
