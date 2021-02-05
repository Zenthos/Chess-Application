import React from 'react';
import { Link } from 'react-router-dom';
import chess from '../assets/chess.jpg';
import source from '../assets/source.jpg';
import person from '../assets/person.jpg';
import "../styles/ComponentCSS.css";

const Home = () => {
  return (
    <div className="container align-center">

      <div className="jumbotron-chess d-flex h-100 my-3 p-3 p-md-5 text-white rounded bg-primary" align="center">
        <div className="justify-content-center align-self-center">
          <h1 className="display-4 font-italic">Chessrooms</h1>
          <p className="lead my-3">
            Welcome to the home page of this Chess Website. 
            Find out about who made this website, 
            figure out the basics of chess, 
            or just click below to start playing Chess.</p>
          <Link to="/play">
            <button className="btn btn-primary mb-0">Play Now! &#x2794;</button>
          </Link>
        </div>
      </div>

      <hr className="my-4" />

      <div className="row d-flex">
        <div className="col-sm-6 justify-content-center align-self-center" align="center">
          <h1 className="my-2">Don't know how to play?</h1>
          <Link to="/how-to-play">
            <button className="my-3 btn btn-primary">Learn the Rules!</button>
          </Link>
        </div>
        <div className="col-sm-6">
          <img className="img-fluid" src={chess} alt="" />
        </div>
      </div>

      <hr className="my-4" />
      
      <div className="row d-flex">
        <div className="col-sm-6">
          <img className="img-fluid px-5" src={person} alt="" />
        </div>
        <div className="col-sm-6 justify-content-center align-self-center" align="center">
          <h1 className="my-2">Who made this website?</h1>
          <Link to="/about">
            <button className="my-3 btn btn-primary">Find out about the Creator!</button>
          </Link>
        </div>
      </div>

      <hr className="my-4" />

      <div className="row d-flex">
        <div className="col-sm-6 justify-content-center align-self-center" align="center">
          <h1 className="my-2">See the Source Code!</h1>
          <p>Click the Button below to check out the code that went into my website.</p>
          <p>Please submit an issue if you see something wrong with either the website, or my code.</p>
          <a href="https://github.com/Zenthos/Chess-Application">
            <button className="my-3 btn btn-primary">Github</button>
          </a>
        </div>
        <div className="col-sm-6">
          <img className="img-fluid rounded" src={source} alt="" />
        </div>
      </div>

    </div>
  )
}

export default Home;