import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faGraduationCap, faBook, faLaptopCode, faChessPawn, faChessBoard } from '@fortawesome/free-solid-svg-icons';
import chess from '../assets/chess.jpg';
import source from '../assets/source.jpg';
import person from '../assets/person.jpg';
import "../styles/ComponentCSS.css";

const Home = () => {
  return (
    <div className="container align-center">

      <div className="jumbotron-chess d-flex h-100 my-3 p-3 p-md-5 text-white rounded bg-primary" align="center">
        <div className="col-md-6 m-auto justify-content-center align-self-center">
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

      <h2 className="text-center">Resources</h2>
      <hr className="mt-4" />
      <div className="row text-center">
        <div className="col-lg-3 col-md-6">
          <FontAwesomeIcon icon={faChessBoard} className="my-3" size="8x" />
          <h3 className="h4 mb-2">Learn The Basics</h3>
          <p className="text-muted mb-0">Anyone can learn how to play chess. Use this site to build your foundation.</p>
        </div>
        <div className="col-lg-3 col-md-6">
          <FontAwesomeIcon icon={faChessPawn} className="my-3" size="8x" />
          <h3 className="h4 mb-2">World-Wide Support</h3>
          <p className="text-muted mb-0">Visit our forum or chatroom if you have a question. No questions are stupid.</p>
        </div>
        <div className="col-lg-3 col-md-6">
          <FontAwesomeIcon icon={faBook} className="my-3" size="8x" />
          <h3 className="h4 mb-2">Regularly Updated</h3>
          <p className="text-muted mb-0">All information on this site is consistently being improved upon and updated!</p>
        </div>
        <div className="col-lg-3 col-md-6">
          <FontAwesomeIcon icon={faHeart} className="my-3" size="8x" />
          <h3 className="h4 mb-2">Made for All People</h3>
          <p className="text-muted mb-0">Play with your friends, watch live matches, and even practice playing against AI!</p>
        </div>
      </div>

      <hr className="my-4" />

      <div className="row d-flex">
        <div className="col-sm-6 justify-content-center align-self-center" align="center">
          <h1 className="my-2">Don't know how to play?</h1>
          <p>
            Click the Button below to learn the basic and advanced moves of chess, and to begin your chess journey.
          </p>
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
        <div className="col-sm-6 justify-content-center align-self-center" align="center">
          <h1 className="my-2">Who made this website?</h1>
          <p>
            Click the Button below to check out the person who created this website, planned future updates, and 
            some other projects created by the same author.
          </p>
          <Link to="/about">
            <button className="my-3 btn btn-primary">Find out about the Creator!</button>
          </Link>
        </div>
        <div className="col-sm-6 order-md-first order-sm-last">
          <img className="img-fluid px-5" src={person} alt="" />
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