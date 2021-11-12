import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthService } from 'src/Services/AuthService';
import { AuthContext } from 'src/Contexts/AuthContext';
import { Alert } from 'src/Components';
import 'src/Styles/ComponentCSS.css';

interface AlertType {
  msg: string;
  type: 'success' | 'danger';
}

export const Login = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [readyToRedirect, setReadyToRedirect] = useState(false);

  const { setUser, setIsAuthenticated, isSubmitting, setIsSubmitting } = useContext(AuthContext);

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (email !== '' && password !== '') {
      AuthService.login({ email, password })
        .then(res => {
          if (res.messages.length === 1 && res.messages[0].type === 'success') {
            setUser(res.user);
            setIsSubmitting(true);
            setTimeout(() => {
              setIsAuthenticated(true);
              setReadyToRedirect(true);
              setIsSubmitting(false);
            }, 3000);
          }

          setAlerts(res.messages);
        })
        .catch(err => console.log(err));
    } else {
      setAlerts([{ msg: 'Please fill out all fields', type: 'danger' }]);
    }
  };

  const handleForgot = (event: React.MouseEvent) => {
    event.preventDefault();
    setAlerts([{ msg: 'Feature is currently unavailable.', type: 'danger' }]);
  };

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts([]);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
    return () => {};
  }, [alerts]);

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

            { readyToRedirect ? <Navigate to={{ pathname: '/' }} />: ''}

            <Link className={`btn btn-primary btn-block ${isSubmitting ? 'disabled':''}`} to='/register'>Need an Account? Register</Link> <br />

            { alerts.map((value, index) => {
              return <Alert key={index} status={value.type} message={value.msg} />;
            })}
            <a className={`text-decoration-none ${isSubmitting ? 'disabled':''}`} onClick={handleForgot} href="/">Forgot Password?</a>
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
  );
};
