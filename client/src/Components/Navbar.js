import React, { useContext } from 'react';
import { Nav, Dropdown, Navbar as NavComponent } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../Context/AuthContext';

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const NotAuthenticated = () => {
    return (
      <>
        <Link className="nav-item nav-link text-white" to="/">Home</Link>
        <Link className="nav-item nav-link text-white" to="/about">About</Link>
        <Link className="nav-item nav-link text-white" to="/play">Play</Link>
        <Link className="nav-item nav-link text-white" to="/login">Login</Link>
        <Link className="nav-item nav-link text-white" to="/register">Register</Link>
      </>
    )
  }

  const Authenticated = () => {
    return (
      <>
        <Link className="nav-item nav-link text-white" to="/">Home</Link>
        <Link className="nav-item nav-link text-white" to="/about">About</Link>
        <Link className="nav-item nav-link text-white" to="/play">Play</Link>
        <Dropdown alignRight>
          <Dropdown.Toggle className="nav-item nav-link text-white py-1 px-2">
            <FontAwesomeIcon className="text-white" icon={faUserCircle} size="3x" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Link className="dropdown-item" to="/profile">Profile</Link>
            <Link className="dropdown-item" to="/settings">Settings</Link>
            <Dropdown.Divider />
            <Link className="dropdown-item" to="/logout">Logout</Link>
          </Dropdown.Menu>
        </Dropdown>
      </>
    )
  }

  return (
    <NavComponent bg="primary" collapseOnSelect expand="lg">
      <Link className="text-decoration-none" to="/">A Website  </Link>
      <NavComponent.Toggle aria-controls="responsive-navbar-nav" />
      <NavComponent.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          { isAuthenticated ? <Authenticated /> : <NotAuthenticated /> }
        </Nav>
      </NavComponent.Collapse>
    </NavComponent>
  )
}

export default Navbar;