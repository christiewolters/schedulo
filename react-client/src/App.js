import './Css/site.css';
import './Css/boot-spacing.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import NotFound from './Components/NotFound';
import Login from './Components/Login';
import AuthContext from './AuthContext';
import EmployeeHome from './Components/EmployeeHome';
import BuildAvailability from './Components/BuildAvailability';

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
          <EmployeeHome/>
          </Route>
          <Route path="/about">
          </Route>
          <Route path="/contact">
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/employee">
            <BuildAvailability />
          </Route>
          {/* <Route path="/solarpanels/add">
          <SolarPanelForm />
        </Route>
        <Route path="/solarpanels/edit/:id">
          <SolarPanelForm />
        </Route> */}
          <Route path={['/employee/availability', '/employee/view_schedule']}>
            {auth.user ? (
              <BuildAvailability />
            ) : (
              <Redirect to="/login" />
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