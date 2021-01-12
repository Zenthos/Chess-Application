import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Alert } from '../Components';
import AuthService from '../Service/AuthService';
import { AuthContext } from '../Context/AuthContext';

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
        if (res.messages) {
          if (res.messages.length === 1 && res.messages[0].type === "success") {
          setUser(res.user);
          setIsSubmitting(true);
          setTimeout(() => {
            setIsAuthenticated(true);
            setReadyToRedirect(true);
            setIsSubmitting(false);
          }, 3000)

          setAlerts(res.messages)}
        } else {
          console.log(res);
        }
      })
      .catch(err => console.log(err));
    } else {
      setAlerts([{ msg: 'Please fill out all fields', type: 'danger' }]);
    }
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
      <div className="row mt-5">
        <div className="card col-md-6 m-auto">
          <form className="text-center">
            <img className="m-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="108" height="108" />
            <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>

            <input className="form-control my-3" type="email" onChange={handleEmail} disabled={isSubmitting} placeholder="Email address"/>
            <input className="form-control my-3" type="password" onChange={handlePassword} disabled={isSubmitting} placeholder="Password"/>

            <button className="btn btn-primary btn-block my-3" onClick={handleSubmit} disabled={isSubmitting} type="submit">Sign in</button>
            
            { alerts.map((value, index) => {
              return <Alert key={index} status={value.type} message={value.msg} />
            })}

            { readyToRedirect ? <Redirect to={{ pathname: '/' }} />: ""}

            <Link className={`text-decoration-none ${isSubmitting ? "disabled":""}`} to='/register'>Need an Account? Register</Link>
            <p className="my-3 text-muted">© 2019-2020</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;