import React, { useContext, useState, useEffect } from 'react';
import { Nav, Dropdown, Navbar as NavComponent } from 'react-bootstrap';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import '../styles/ComponentCSS.css';

const Navbar = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, isSubmitting } = useContext(AuthContext);
  const [readyToRedirect, setReadyToRedirect] = useState(false);

  const toggleHandler = (event, onClick) => {
    event.preventDefault();
    onClick(event);
  };

  const CustomToggle = React.forwardRef(({ children, onClick }: any, ref) => (
    <a href="/" className={'navbar-link m-0'} ref={ref} onClick={(event) => toggleHandler(event, onClick)}>
      <FontAwesomeIcon className="text-white" icon={faUserCircle} size="2x" />
      {children}
      {' '} &#x25bc;
    </a>
  ));

  CustomToggle.displayName = 'CustomToggle';

  const LogoutHandler = () => {
    AuthService.logout()
      .then( data =>{
        if (data.success) {
          setUser({ username: 'None' });
          setIsAuthenticated(false);
          setReadyToRedirect(true);
        }
      })
      .catch(err => console.log(err));
  };

  const NotAuthenticated = () => {
    return (
      <>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} exact to="/search">
          <FontAwesomeIcon className="text-white mx-2" icon={faSearch} />
        </NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} exact to="/">Home</NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} to="/about">About</NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} to="/how-to-play">How to Play</NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} to="/forum">Forum</NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} to="/play">Play Chess</NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} to="/login">Login</NavLink>
        <NavLink className={'bg-secondary navbar-link rounded'} activeClassName={'navbar-active bg-dark'} to="/register">Sign Up</NavLink>
      </>
    );
  };

  const Authenticated = () => {
    return (
      <>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} exact to="/search">
          <FontAwesomeIcon className="text-white mx-2" icon={faSearch} />
        </NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} exact to="/">Home</NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} to="/about">About</NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} to="/how-to-play">How to Play</NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} to="/forum">Forum</NavLink>
        <NavLink className={'navbar-link'} activeClassName={'navbar-active'} to="/play">Play Chess</NavLink>
        <Dropdown alignRight>
          <Dropdown.Toggle as={CustomToggle}>
          </Dropdown.Toggle>
          <Dropdown.Menu className='mb-2'>
            <NavLink className={'dropdown-item'} activeClassName={'dropdown-active'} to={`/profile/${user.username}`}>Profile</NavLink>
            <NavLink className={'dropdown-item'} activeClassName={'dropdown-active'} to="/friends">Friends</NavLink>
            <NavLink className={'dropdown-item'} activeClassName={'dropdown-active'} to="/settings">Settings</NavLink>
            <Dropdown.Divider />
            <NavLink className={'dropdown-item'} activeClassName={'dropdown-active'} to="/forum">Forums</NavLink>
            <Dropdown.Divider />
            <button className={'dropdown-item'} onClick={LogoutHandler}>Logout</button>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  };

  useEffect(() => {
    if (readyToRedirect)
      setReadyToRedirect(false);
  }, [readyToRedirect]);

  return (
    <>
      { readyToRedirect ? <Redirect to="/login" />: '' }
      <NavComponent className={ isSubmitting ? 'disabled':'' } variant="dark" bg="primary" expand="lg">
        <Link className="text-decoration-none" to="/">Chessrooms</Link>
        <NavComponent.Toggle aria-controls="responsive-navbar-nav" />
        <NavComponent.Collapse id="responsive-navbar-nav" >
          <Nav variant="pills" className="ml-auto">
            { isAuthenticated ? <Authenticated /> : <NotAuthenticated /> }
          </Nav>
        </NavComponent.Collapse>
      </NavComponent>
    </>
  );
};

export default Navbar;
