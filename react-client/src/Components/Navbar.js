import { NavLink, Link } from 'react-router-dom';
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


                        <ul className="nav navbar-nav">

                            <li className={(window.location.pathname == "/" ? "active" : "")} ><NavLink to="/" activeClassName="active">My Shifts</NavLink></li>

                            {auth.user.hasRole("ROLE_EMPLOYEE") && (
                                <>
                                    <li className={(window.location.pathname == "/employee/availability" ? "active" : "")}><Link to="/employee/availability">My Availability</Link></li>
                                </>
                            )}

                            {auth.user.hasRole("ROLE_MANAGER") && (
                                <li  className={(window.location.pathname == "/manager/schedules" ? "active" : "")}><Link to="/manager/schedules">Schedules</Link></li>
                            )}

                        </ul>



                        {auth.user && (
                            <p className="navbar-text navbar-right">
                                Signed in as {auth.employee.firstName} {auth.employee.lastName}.
                                <a className="navbar-link" href="" onClick={() => auth.logout()}> Sign out.</a>
                            </p>
                        )}

                        {!auth.user && (
                            <p>
                                <Link to="/login">Dave. You shouldn't be here right now.</Link>
                            </p>
                        )}

                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;