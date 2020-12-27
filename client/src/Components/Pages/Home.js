import React from 'react';
import { Link } from 'react-router-dom';
import "../ComponentCSS.css";

const Home = () => {
  return (
    <div className="container align-center">

      <div className="jumbotron-test my-3 p-3 p-md-5 text-white rounded bg-primary">
        <div className="col-md-6 px-0">
          <h1 className="display-4 font-italic">Play Chess Free!</h1>
          <p className="lead my-3">Welcome to the home page of this Chess Website built using the Full Stack MERN Framework. Find out about who made this website in the About Section, or figure out the basics of chess in the Learn Section, or just click below to play a game of chess.</p>
          <Link to="/play">
            <p className="lead mb-0"><u>Click Me to Play</u></p>
          </Link>
        </div>
      </div>

      <h1 className="my-2">Don't know how to play?</h1>
      <Link to="/how-to-play">
        <button className="my-3 btn btn-primary">Learn the Basics!</button>
      </Link>

      <h1 className="my-2">Who made this website?</h1>
      <Link to="/about">
        <button className="my-3 btn btn-primary">Find out about the Creator!</button>
      </Link>
      
      <h1 className="my-2">See the Source Code!</h1>
      <p>Click the Button below to check out the code that went into my website.</p>
      <p>Please submit an issue if you see something wrong with either the website, or my code.</p>
      <a href="https://github.com/Zenthos/Chess-Application">
        <button className="my-3 btn btn-primary">Github</button>
      </a>
    </div>
  )
}

export default Home;