import React, { useContext, useState } from 'react';
import { Nav, Dropdown, Navbar as NavComponent } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../Context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

  const NotAuthenticated = () => {
    return (
      <>
        <Link className="nav-item nav-link text-white" to="/">Home</Link>
        <Link className="nav-item nav-link text-white" to="/about">About</Link>
        <Link className="nav-item nav-link text-white" to="/how-to-play">Learn</Link>
        <Link className="nav-item nav-link text-white" to="/play">Play Chess</Link>
        <Link className="nav-item nav-link text-white" to="/login">Login</Link>
      </>
    )
  }

  const Authenticated = () => {
    return (
      <>
        <Link className="nav-item nav-link text-white" to="/">Home</Link>
        <Link className="nav-item nav-link text-white" to="/about">About</Link>
        <Link className="nav-item nav-link text-white" to="/how-to-play">Learn</Link>
        <Link className="nav-item nav-link text-white" to="/play">Play Chess</Link>
        <Dropdown alignRight>
          <Dropdown.Toggle className="nav-item nav-link text-white py-1 px-2">
            <FontAwesomeIcon className="text-white" icon={faUserCircle} size="3x" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Link className="dropdown-item" to={`/profile/${user.username}`}>Profile</Link>
            <Link className="dropdown-item" to="/settings">Settings</Link>
            <Dropdown.Divider />
            <Link className="dropdown-item" to="/logout">Logout</Link>
          </Dropdown.Menu>
        </Dropdown>
      </>
    )
  }

  const navToggle = () => {
    setExpanded(expanded ? false : true);
  }
  
  const navClose = () => {
    setExpanded(false);
  }

  return (
    <NavComponent onToggle={navToggle} expanded={expanded} bg="primary" expand="lg">
      <Link className="text-decoration-none" to="/">Chessrooms</Link>
      <NavComponent.Toggle aria-controls="responsive-navbar-nav" />
      <NavComponent.Collapse id="responsive-navbar-nav" >
        <Nav className="ml-auto" onClick={navClose}>
          { isAuthenticated ? <Authenticated /> : <NotAuthenticated /> }
        </Nav>
      </NavComponent.Collapse>
    </NavComponent>
  )
}

export default Navbar;