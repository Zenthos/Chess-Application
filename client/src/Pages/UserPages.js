import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Alert } from '../Components';
import AuthService from '../Service/AuthService';
import { AuthContext } from '../Context/AuthContext';
import "../styles/ComponentCSS.css";

const Login = () => {
  const [alerts, setAlerts] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [readyToRedirect, setReadyToRedirect] = useState(false);

  const { setUser, setIsAuthenticated, isSubmitting, setIsSubmitting } = useContext(AuthContext);

  const handleEmail = event => setEmail(event.target.value);
  const handlePassword = event => setPassword(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    if(email !== '' && password !== '') {
      AuthService.login({ email, password })
      .then(res => {
        if (res.messages.length === 1 && res.messages[0].type === "success") {
          setUser(res.user);
          setIsSubmitting(true);
          setTimeout(() => {
            setIsAuthenticated(true);
            setReadyToRedirect(true);
            setIsSubmitting(false);
          }, 3000);
        }

        setAlerts(res.messages)
      })
      .catch(err => console.log(err));
    } else {
      setAlerts([{ msg: 'Please fill out all fields', type: 'danger' }]);
    }
  }

  const handleForgot = (event) => {
    event.preventDefault();
    setAlerts([{ msg: 'Feature is currently unavailable.', type: 'danger' }]);
  }

  useEffect(() => {
    if (alerts.length > 0) {
      let timer = setTimeout(() => {
        setAlerts([]);
      }, 3000)

      return () => clearTimeout(timer);
    }
  }, [alerts])

  return (
    <div className="container">
      <div className="row my-3">
        <div className="card col-md-6 m-auto">
          <form className="text-center">
            <img className="m-4" src="/android-chrome-192x192.png" alt="" width="108" height="108" />
            <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>

            <input className="form-control my-3" type="email" onChange={handleEmail} disabled={isSubmitting} placeholder="Email address"/>
            <input className="form-control my-3" type="password" onChange={handlePassword} disabled={isSubmitting} placeholder="Password"/>

            <button className="btn btn-primary btn-block my-3" onClick={handleSubmit} disabled={isSubmitting} type="submit">Sign in</button>
            
            { readyToRedirect ? <Redirect to={{ pathname: '/' }} />: ""}

            <Link className={`btn btn-primary btn-block ${isSubmitting ? "disabled":""}`} to='/register'>Need an Account? Register</Link> <br />

            { alerts.map((value, index) => {
              return <Alert key={index} status={value.type} message={value.msg} />
            })}
            <a className={`text-decoration-none ${isSubmitting ? "disabled":""}`} onClick={handleForgot} href="/">Forgot Password?</a>
            <p className="my-3 text-muted">© 2019-2020</p>
          </form>
        </div>
      </div>
      <div className="row my-3">
        <div className="card col-md-6 m-auto">
          <p className="my-3 text-center">Test Account<br/>Username: test<br/>Password: test</p>
        </div>
      </div>
    </div>
  )
}

const Register = () => {
  const [alerts, setAlerts] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [readyToRedirect, setReadyToRedirect] = useState(false);

  const { isSubmitting, setIsSubmitting } = useContext(AuthContext);

  const handleUsername = event => setUsername(event.target.value);
  const handleEmail = event => setEmail(event.target.value);
  const handlePassword = event => setPassword(event.target.value);
  const handleConfirmPassword = event => setConfirmPassword(event.target.value);
  
  const handleSubmit = (event) => {
    event.preventDefault();

    if (![username, email, password, confirmPassword].some((field) => field === '' || field.length < 5) && password === confirmPassword) {
      fetch('/user/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      })
      .then(data => data.json())
      .then(res => {
        setAlerts(res.messages)
        setIsSubmitting(true);
        setTimeout(() => {
          setReadyToRedirect(true);
          setIsSubmitting(false);
        }, 3000);
      })
      .catch(err => console.log(err));
    } else {
      if (password !== confirmPassword)
        setAlerts([ { msg: "Passwords do not match", type: "danger" } ]);
      else if (username.length < 5 || password.length < 5)
        setAlerts([ { msg: "Username and password must be >5 characters", type: "danger" }]);
      else
        setAlerts([ { msg: "Please fill out all fields", type: "danger" } ]);
    }
  }

  useEffect(() => {
    if (alerts.length > 0) {
      let timer = setTimeout(() => {
        setAlerts([]);
      }, 5000)

      return () => clearTimeout(timer);
    }
  }, [alerts])

  return (
    <div className="container">
      <div className="row my-3">
        <div className="card col-md-6 m-auto">
          <form className="text-center" onSubmit={handleSubmit}>
            <img className="m-4" src="/android-chrome-192x192.png" alt="" width="108" height="108" />
            <h1 className="h3 mb-3 font-weight-normal">Register</h1>

            <input className="form-control my-3" type="text" onChange={handleUsername} disabled={isSubmitting} placeholder="Username"/>
            <input className="form-control my-3" type="email" onChange={handleEmail} disabled={isSubmitting} placeholder="Email address"/>
            <input className="form-control my-3" type="password" onChange={handlePassword} disabled={isSubmitting} placeholder="Password"/>
            <input className="form-control my-3" type="password" onChange={handleConfirmPassword} disabled={isSubmitting} placeholder="Confirm Password"/>

            <button className="btn btn-primary btn-block my-3" type="submit" disabled={isSubmitting}>Register</button>

            { alerts.map((value, index) => {
              return <Alert key={index} status={value.type} message={value.msg} />
            })}

            { readyToRedirect ? <Redirect to={{ pathname: '/login' }} />: ""}

            <Link className={`text-decoration-none ${isSubmitting ? "disabled":""}`} to='/login'>Already have an Account? Login</Link>

            <p className="my-3 text-muted">© 2019-2020</p>
          </form>
        </div>
      </div>
    </div>
  )
}

const Friends = () => {
  return (
    <div className="container align-center">
      <h1>Friends Page</h1>
    </div>
  )
}

const Settings = () => {
  return (
    <div className="container align-center">
      <h1>Settings Page</h1>
    </div>
  )
}

export default { Login, Register, Friends, Settings };