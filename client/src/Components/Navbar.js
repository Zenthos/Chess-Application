import React, { useContext, useState, useEffect } from 'react';
import { Nav, Dropdown, Navbar as NavComponent } from 'react-bootstrap';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../Context/AuthContext';
import AuthService from '../Service/AuthService';
import '../styles/ComponentCSS.css';

const Navbar = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, isSubmitting } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  const [readyToRedirect, setReadyToRedirect] = useState(false);

  const toggleHandler = (event, onClick) => {
    event.preventDefault();
    onClick(event);
  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a href="/" className={'navbar-link m-0'} ref={ref} onClick={(event) => toggleHandler(event, onClick)}>
      <FontAwesomeIcon className="text-white" icon={faUserCircle} size="2x" />
      {children}
      {` `} &#x25bc;
    </a>
  ));

  const LogoutHandler = () => {
    AuthService.logout()
      .then( data =>{
        if(data.success){
          setUser({ username: "None" });
          setIsAuthenticated(false);
          setReadyToRedirect(true);
        }
      })
      .catch(err => console.log(err));
  }

  const NotAuthenticated = () => {
    return (
      <>
        <NavLink className={`navbar-link`} activeClassName={`navbar-active`} exact to="/">Home</NavLink>
        <NavLink className={`navbar-link`} activeClassName={`navbar-active`} to="/about">About</NavLink>
        <NavLink className={`navbar-link`} activeClassName={`navbar-active`} to="/how-to-play">How to Play</NavLink>
        <NavLink className={`navbar-link`} activeClassName={`navbar-active`} to="/play">Play Chess</NavLink>
        <NavLink className={`navbar-link`} activeClassName={`navbar-active`} to="/login">Login</NavLink>
      </>
    )
  }

  const Authenticated = () => {
    return (
      <>
        <NavLink className={`navbar-link`} activeClassName={`navbar-active`} exact to="/">Home</NavLink>
        <NavLink className={`navbar-link`} activeClassName={`navbar-active`} to="/play">Play Chess</NavLink>
        <Dropdown alignRight>
          <Dropdown.Toggle as={CustomToggle}>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <NavLink className={`dropdown-item`} activeClassName={`dropdown-active`} to={`/profile/${user.username}`}>Profile</NavLink>
            <NavLink className={`dropdown-item`} activeClassName={`dropdown-active`} to="/friends">Friends</NavLink>
            <NavLink className={`dropdown-item`} activeClassName={`dropdown-active`} to="/settings">Settings</NavLink>
            <Dropdown.Divider />
            <NavLink className={`dropdown-item`} activeClassName={`dropdown-active`} to="/about">About</NavLink>
            <NavLink className={`dropdown-item`} activeClassName={`dropdown-active`} to="/how-to-play">Learn Chess</NavLink>
            <Dropdown.Divider />
            <button className={`dropdown-item`} onClick={LogoutHandler}>Logout</button>
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

  useEffect(() => {
    if (readyToRedirect)
      setReadyToRedirect(false);
  }, [readyToRedirect]);

  return (
    <>
      { readyToRedirect ? <Redirect to="/login" />: "" }
      <NavComponent className={ isSubmitting ? "disabled":"" } onToggle={navToggle} expanded={expanded} bg="primary" expand="lg">
        <Link className="text-decoration-none" to="/">Chess App</Link>
        <NavComponent.Toggle aria-controls="responsive-navbar-nav" />
        <NavComponent.Collapse id="responsive-navbar-nav" >
          <Nav variant="pills" className="ml-auto" onClick={navClose}>
            { isAuthenticated ? <Authenticated /> : <NotAuthenticated /> }
          </Nav>
        </NavComponent.Collapse>
      </NavComponent>
    </>
  )
}

export default Navbar;