import React from 'react';
import { Link } from 'react-router-dom';
import "../ComponentCSS.css";

const Home = () => {
  return (
    <div className="container align-center">

      <div className="jumbotron-test my-3 p-3 p-md-5 text-white rounded bg-primary">
        <div className="col-md-6 px-0">
          <h1 className="display-4 font-italic">Chess</h1>
          <p className="lead my-3">Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.</p>
          <Link to="/play">
            <p className="lead mb-0"><u>Play Now!</u></p>
          </Link>
        </div>
      </div>

      <h1 className="my-2">Don't know how to play?</h1>
      <Link to="/how-to-play">
        <button className="my-3 btn btn-primary">Learn the Basics!</button>
      </Link>
      
      <h1 className="my-2">See the Source Code!</h1>
      <a href="https://github.com/Zenthos/Chess-Application">
        <button className="my-3 btn btn-primary">Github</button>
      </a>
    </div>
  )
}

export default Home;