import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <footer className="footer card mt-5 py-3">
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-3 mb-5 mb-lg-0">
            <h4 className="text-uppercase mb-4">Chess</h4>
            <Link to="/play" className="btn btn-link p-0">Play</Link><br />
            <Link to="/how-to-play" className="btn btn-link p-0">Learn</Link><br />
            <Link to="/practice" className="btn btn-link p-0">Practice</Link><br />
            <Link to="/shop" className="btn btn-link p-0">Shop</Link><br />
          </div>
          
          <div className="col-lg-3 mb-5 mb-lg-0">
            <h4 className="text-uppercase mb-4">Legal</h4>
            <Link to="/about" className="btn btn-link p-0">Privacy</Link><br />
            <Link to="/about" className="btn btn-link p-0">Terms</Link><br />
            <HashLink to="/about#contact-us" className="btn btn-link p-0">Contact</HashLink><br />
          </div>

          <div className="col-lg-3 mb-5 mb-lg-0">
            <h4 className="text-uppercase mb-4">Resources</h4>
            <Link to="/about" className="btn btn-link p-0">About</Link><br />
            <Link to="/search" className="btn btn-link p-0">Search</Link><br />
            <a href="https://github.com/Zenthos/Chess-Application" className="btn btn-link p-0">Source Code</a><br />
            <Link to="/forum" className="btn btn-link p-0">Forum</Link><br />
          </div>

          <div className="col-lg-3">
            <h4 className="text-uppercase mb-4">Information</h4>
            <p className="lead mb-0">
              Blurb Here
            </p>
          </div>
        </div>

        <hr className="border-top border-white my-5"/>

        <div className="row my-2">
          <div className="col"><small>Copyright Chessrooms © 2021</small></div>
          <div className="col text-right">
            <a href="/">
              <FontAwesomeIcon className="text-white mx-2" icon={faInstagram} size="2x" />
            </a>  
            <a href="/">
              <FontAwesomeIcon className="text-white mx-2" icon={faTwitter} size="2x" />
            </a>
            <a href="/">
              <FontAwesomeIcon className="text-white mx-2" icon={faFacebook} size="2x" />
            </a>
            <a href="/">
              <FontAwesomeIcon className="text-white mx-2" icon={faLinkedin} size="2x" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;