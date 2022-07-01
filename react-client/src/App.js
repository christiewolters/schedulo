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
  const [restoreLoginAttemptCompleted, setRestoreLoginAttemptCompleted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('schedulerToken');
    if (token) {
      // We want to wait until the login() function is done with its work
      // before we update the restoreLoginAttemptCompleted state variable.
      login(token).then(() => setRestoreLoginAttemptCompleted(true));
    } else {
      // If we don't have a token, then it's okay to immediately update the 
      // restoreLoginAttemptCompleted state variable.
      setRestoreLoginAttemptCompleted(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('schedulerToken', token);
    const { sub: username, authorities, appUserId } = jwt_decode(token);
    const roles = authorities.split(',');
    // create our user object
    const userToLogin = {
      appUserId,
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
    const init = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };
    // Return this promise so that we can know when the login() method has completed its work.
    return fetch(`http://localhost:8080/api/employees/user/${username}`, init)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => setEmployee(data))
      .catch(console.log);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('schedulerToken');
  };

  const auth = {
    user,
    login,
    logout,
    employee
  };

  console.log(auth);

  if (!restoreLoginAttemptCompleted) {
    return null;
  }

  
  return (
    <div className="container">
      <AuthContext.Provider value={auth}>
        <Router>
          <Switch>
            <Route path="/" exact>
              {!auth.user ? (<Redirect to="/login" />)
                : auth.user.hasRole("ROLE_MANAGER") ?
                  (<ManagerHome />) : (<EmployeeHome />)}
            </Route>
            <Route path="/login">
              {auth.user ?
                (<Redirect to="/" />) : (<Login />)}
            </Route>
            <Route path="/manager/schedules" exact>
              {!auth.user ? (<Redirect to="/login" />)
                : auth.user.hasRole("ROLE_MANAGER") ?
                  (<ViewSchedules />) : (<NoPermission />)}
            </Route>
            <Route path="/employee/availability">
              {!auth.user ? (<Redirect to="/login" />)
                : auth.user.hasRole("ROLE_EMPLOYEE") ?
                  (<AvailabilityList />) : (<NoPermission />)}
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