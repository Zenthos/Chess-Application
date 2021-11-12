import React, { useContext, useState, useEffect } from 'react';
import { Nav, Dropdown, Navbar as NavComponent } from 'react-bootstrap';
import { Link, NavLink, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from 'src/Contexts/AuthContext';
import { AuthService } from 'src/Services/AuthService';
import 'src/Styles/ComponentCSS.css';

const Navbar = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, isSubmitting } = useContext(AuthContext);
  const [readyToRedirect, setReadyToRedirect] = useState(false);

  const toggleHandler = (event: React.MouseEvent<HTMLAnchorElement>, onClick: any) => {
    event.preventDefault();
    onClick(event);
  };

  const CustomToggle = React.forwardRef(({ children, onClick }: any, ref) => (
    <a href="/" className={'navbar-link m-0'} onClick={(event) => toggleHandler(event, onClick)}>
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
        <NavLink className={'navbar-link'} to="/search">
          <FontAwesomeIcon className="text-white mx-2" icon={faSearch} />
        </NavLink>
        <NavLink className={'navbar-link'} to="/">Home</NavLink>
        <NavLink className={'navbar-link'} to="/about">About</NavLink>
        <NavLink className={'navbar-link'} to="/how-to-play">How to Play</NavLink>
        <NavLink className={'navbar-link'} to="/forum">Forum</NavLink>
        <NavLink className={'navbar-link'} to="/play">Play Chess</NavLink>
        <NavLink className={'navbar-link'} to="/login">Login</NavLink>
        <NavLink className={'bg-secondary navbar-link rounded'} to="/register">Sign Up</NavLink>
      </>
    );
  };

  const Authenticated = () => {
    return (
      <>
        <NavLink className={'navbar-link'} to="/search">
          <FontAwesomeIcon className="text-white mx-2" icon={faSearch} />
        </NavLink>
        <NavLink className={'navbar-link'} to="/">Home</NavLink>
        <NavLink className={'navbar-link'} to="/about">About</NavLink>
        <NavLink className={'navbar-link'} to="/how-to-play">How to Play</NavLink>
        <NavLink className={'navbar-link'} to="/forum">Forum</NavLink>
        <NavLink className={'navbar-link'} to="/play">Play Chess</NavLink>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
          </Dropdown.Toggle>
          <Dropdown.Menu className='mb-2'>
            <NavLink className={'dropdown-item'} to={`/profile/${user.username}`}>Profile</NavLink>
            <NavLink className={'dropdown-item'} to="/friends">Friends</NavLink>
            <NavLink className={'dropdown-item'} to="/settings">Settings</NavLink>
            <Dropdown.Divider />
            <NavLink className={'dropdown-item'} to="/forum">Forums</NavLink>
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
      { readyToRedirect ? <Navigate to="/login" />: '' }
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
