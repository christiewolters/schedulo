import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import AuthContext from '../AuthContext';

function Navbar() {
    const auth = useContext(AuthContext);
    console.log(auth);

    return (
        <>
<nav className="navbar navbar-inverse" role="navigation">
                  <div className="container-fluid">
                    <div className="navbar-header">
                      <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-7">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                      </button>
                      <a className="navbar-brand" href="#">Shift Scheduler</a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-7">
                      <p className="navbar-text navbar-right">Signed in as {auth.employee.firstName} {auth.employee.lastName}. <a className="navbar-link" href="">Sign out.</a></p>
                    </div>
                  </div>
                </nav>



            <ul className="collapse navbar-collapse" id="bs-example-navbar-collapse-7" >
                <li><Link to="/">My Shifts</Link></li>
                {auth.user.hasRole("ROLE_EMPLOYEE") && (
                    <>
                        <li><Link to="/employee/availability">My Availability</Link></li>
                    </>
                )}

                {auth.user.hasRole("ROLE_MANAGER") && (
                    <li><Link to="/manager/schedules">Schedules</Link></li>
                )}

                {auth.user && (
                    <>
                        <li>{auth.user.username}</li>
                        <li><button onClick={() => auth.logout()}>Logout</button></li>
                    </>
                )}

                {!auth.user && (
                    <>
                        <li><Link to="/login">Dave. You shouldn't be here right now.</Link></li>
                    </>
                )}

            </ul>
        </>
    );
}

export default Navbar;