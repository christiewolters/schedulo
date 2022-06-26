import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from '../AuthContext';
import DisplayErrors from './DisplayErrors';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const auth = useContext(AuthContext);

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
    POST http://localhost:8080/api/authenticate HTTP/1.1
    Content-Type: application/json
    {
      "username": "john@smith.com",
      "password": "P@ssw0rd!"
    }
    */

    const authAttempt = {
      username,
      password
    };

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(authAttempt)
    };

    fetch('http://localhost:8080/api/authenticate', init)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 403) {
          return null;
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => {
        if (data) {
          // {
          //   "jwt_token": "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjYWxvcmllLXRyYWNrZXIiLCJzdWIiOiJzbWFzaGRldjUiLCJhdXRob3JpdGllcyI6IlJPTEVfVVNFUiIsImV4cCI6MTYwNTIzNDczNH0.nwWJtPYhD1WlZA9mGo4n5U0UQ3rEW_kulilO2dEg7jo"
          // }
          auth.login(data.jwt_token);
          history.push('/');
        } else {
          // we have error messages
          setErrors(['login failure']);
        }
      })
      .catch(console.log);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <>
      <div class="panel panel-default login-panel">
        <div class="panel-body p-5">
          
          <h3 className="text-center">Log In to Your Account</h3>

          <DisplayErrors errors={errors} />

          <form onSubmit={handleSubmit}>

              <div className="row form-outline mb-4">
                <label className="form-label" htmlFor="username">Username</label>
                <input id="username" type="text" className="form-control" placeholder="Employee Id"
                  onChange={handleUsernameChange} value={username} />
              </div>

              <div className="row form-outline mb-4">
                <label className="form-label" htmlFor="password">Password</label>
                <input id="password" type="password" className="form-control" placeholder="********"
                  onChange={(event) => setPassword(event.target.value)} value={password} />
              </div>

              <div className="row pt-4 text-center">
                <button type="submit" className="btn btn-primary btn-block">Login</button>
                <small>Need an account? <Link to="/register">Sign up</Link></small>
              </div>

          </form>


        </div>
      </div>
    </>
  );
}

export default Login;