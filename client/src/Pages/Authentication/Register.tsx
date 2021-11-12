import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from 'src/Contexts/AuthContext';
import { Alert } from 'src/Components';
import 'src/Styles/ComponentCSS.css';

interface AlertType {
  msg: string;
  type: 'success' | 'danger';
}

export const Register = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [readyToRedirect, setReadyToRedirect] = useState(false);

  const { isSubmitting, setIsSubmitting } = useContext(AuthContext);

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
  const handleConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value);

  const handleSubmit = (event: React.FormEvent) => {
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
          setAlerts(res.messages);
          setIsSubmitting(true);
          setTimeout(() => {
            setReadyToRedirect(true);
            setIsSubmitting(false);
          }, 3000);
        })
        .catch(err => console.log(err));
    } else {
      if (password !== confirmPassword)
        setAlerts([ { msg: 'Passwords do not match', type: 'danger' } ]);
      else if (username.length < 5 || password.length < 5)
        setAlerts([ { msg: 'Username and password must be >5 characters', type: 'danger' }]);
      else
        setAlerts([ { msg: 'Please fill out all fields', type: 'danger' } ]);
    }
  };

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
    return () => {};
  }, [alerts]);

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

            { alerts.map((value: any, index) => {
              return <Alert key={index} status={value.type} message={value.msg} />;
            })}

            { readyToRedirect ? <Navigate to="/login" />: ''}

            <Link className={`text-decoration-none ${isSubmitting ? 'disabled':''}`} to='/login'>Already have an Account? Login</Link>

            <p className="my-3 text-muted">© 2019-2020</p>
          </form>
        </div>
      </div>
    </div>
  );
};
