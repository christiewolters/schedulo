import './Css/site.css';
import './Css/boot-spacing.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import Login from './Components/Login';
import AuthContext from './AuthContext';
import AvailabilityList from './Components/AvailabilityList'

import EmployeeHome from './Pages/EmployeeHome';
import ManagerHome from './Pages/ManagerHome';
import NotFound from './Pages/NotFound';
import NoPermission from './Pages/NoPermission';
import ViewSchedules from './Pages/ViewSchedules';

function App() {
  // "null" means that we don't have a logged in user
  // anything other than null, means we have a logged in user
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);

  const login = (token) => {
    const { sub: username, authorities, appUserId } = jwt_decode(token);

    const roles = authorities.split(',');

    // create our user object
    const userToLogin = {
      username,
      appUserId,
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

//get employee from backend
useEffect(() => {
  // Make sure that we have an "user" value...
  if (user) {
    const init = {
      headers: {"Authorization": `Bearer ${user.token}`
    }};
    fetch(`http://localhost:8080/api/employees/user/${user.username}`, init )
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => setEmployee(data))
      .catch(console.log);
  }
}, [user]); // Hey React... please call my arrow function every time the "id" route parameter changes value



  const auth = {
    user,
    login,
    logout,
    employee
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
            {auth.user ? 
            (<Redirect to="/" />) : (<Login />)}
            </Route>

            <Route path="/manager/schedules" exact>
              { !auth.user ? (<Redirect to="/login" />) 
              : auth.user.hasRole("ROLE_MANAGER") ? 
              (<ViewSchedules />) : (<NoPermission /> )}
            </Route>

            <Route path="/employee/availability">
            { !auth.user ? (<Redirect to="/login" />) 
              : auth.user.hasRole("ROLE_EMPLOYEE") ? 
              (<AvailabilityList />) : (<NoPermission /> )}
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