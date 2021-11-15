import React from 'react';
import { Link } from 'src/Components';
import chess from 'src/Assets/chess.jpg';
import source from 'src/Assets/source.jpg';
import person from 'src/Assets/person.jpg';
import { CardMedia, Alert } from '@mui/material';

export const Home = () => {
  return (
    <div>
      <Alert variant="filled" severity="info" sx={{ py: 2 }}>
        This sit is currently undergoing a major revision, please check back later when it is completed.
      </Alert>
      <div>
        <div>
          <h1>ChessRooms</h1>
          <p>
            Welcome to the home page of this Chess Website.
            Find out about who made this website,
            figure out the basics of chess,
            or just click below to start playing Chess.</p>
          <Link to="/play">
            <button>Play Now! &#x2794;</button>
          </Link>
        </div>
      </div>

      <h2>Resources</h2>
      <hr/>
      <div>
        <div>
          <h3>Learn The Basics</h3>
          <p>Anyone can learn how to play chess. Use this site to build your foundation.</p>
        </div>
        <div>
          <h3>World-Wide Support</h3>
          <p>Visit our forum or chatroom if you have a question. No questions are stupid.</p>
        </div>
        <div>
          <h3>Regularly Updated</h3>
          <p>All information on this site is consistently being improved upon and updated!</p>
        </div>
        <div>
          <h3>Made for All People</h3>
          <p>Play with your friends, watch live matches, and even practice playing against AI!</p>
        </div>
      </div>

      <hr/>

      <div>
        <div>
          <h1>Dont know how to play?</h1>
          <p>
            Click the Button below to learn the basic and advanced moves of chess, and to begin your chess journey.
          </p>
          <Link to="/how-to-play">
            <button>Learn the Rules!</button>
          </Link>
        </div>
        <div>
          <CardMedia component="img" image={chess} alt="" />
        </div>
      </div>

      <hr/>

      <div>
        <div>
          <h1>Who made this website?</h1>
          <p>
            Click the Button below to check out the person who created this website, planned future updates, and
            some other projects created by the same author.
          </p>
          <Link to="/about">
            <button>Find out about the Creator!</button>
          </Link>
        </div>
        <div>
          <CardMedia component="img" image={person} alt="" />
        </div>
      </div>

      <hr/>

      <div>
        <div>
          <h1>See the Source Code!</h1>
          <p>Click the Button below to check out the code that went into my website.</p>
          <p>Please submit an issue if you see something wrong with either the website, or my code.</p>
          <a href="https://github.com/Zenthos/Chess-Application">
            <button>Github</button>
          </a>
        </div>
        <div>
          <CardMedia component="img" image={source} alt="" />
        </div>
      </div>
    </div>
  );
};
