import './Css/site.css';
import './Css/boot-spacing.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import Login from './Components/Login';
import AuthContext from './AuthContext';

import EmployeeHome from './Pages/EmployeeHome';
import ManagerHome from './Pages/ManagerHome';
import NotFound from './Pages/NotFound';

function App() {
  // "null" means that we don't have a logged in user
  // anything other than null, means we have a logged in user
  const [user, setUser] = useState(null);

  const login = (token) => {
    const { sub: username, authorities } = jwt_decode(token);

    const roles = authorities.split(',');

    // create our user object
    const userToLogin = {
      username,
      roles,
      token,
      hasRole(role) {
        return this.roles.includes(role);
      }
    };

    console.log(userToLogin);

    // update the global user state variable
    setUser(userToLogin);
  };

  const logout = () => {
    setUser(null);
  };

  const auth = {
    user,
    login,
    logout
  };

  return (
    <div className="container">
      <AuthContext.Provider value={auth}>

        <Router>

          <Switch>

            <Route path="/" exact>
              { !auth.user ? (<Redirect to="/login" />) 
              : auth.user.hasRole("ROLE_MANAGER") ? 
              (<ManagerHome />) : (<EmployeeHome/>)}
            </Route>

            <Route path="/login">
            {auth.user ? (
                <Redirect to="/" />
              ) : (
                <Login />
              )}
            </Route>

            <Route>
              <NotFound />
            </Route>
            
          </Switch>

        </Router>

      </AuthContext.Provider>
    </div>
  );
}

export default App;