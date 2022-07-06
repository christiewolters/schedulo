import { Link, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../AuthContext';

function Navbar() {
    const auth = useContext(AuthContext);
    console.log(auth);



    const location = useLocation();
    const [url, setUrl] = useState(null);

    useEffect(() => {
        setUrl(location.pathname);
    }, [location]);

    if (!auth || auth.user === null) {
        return null;
    }

    return (
        <>
            <nav className="navbar" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-7">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <span><Link to="/" className="navbar-brand">Schedulo</Link></span>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-7">


                        <ul className="nav navbar-nav">


                            {auth.user.hasRole("ROLE_EMPLOYEE") && (
                                <>
                                    <li className={(url === "/employee/availability" ? "active" : "")}><Link to="/employee/availability">Availability</Link></li>
                                </>
                            )}

                            {auth.user.hasRole("ROLE_MANAGER") && (
                                <>
                                    <li className={(url === "/manager/schedules" ? "active" : "")}><Link to="/manager/schedules">Schedules</Link></li>
                                </>
                            )}

                            <li className={(url === "/shifts" ? "active" : "")} ><Link to="/shifts">Shifts</Link></li>

                            {auth.user.hasRole("ROLE_MANAGER") && (
                                <>
                                    <li className={(url === "/manager/register" ? "active" : "")}><Link to="/manager/register">Register</Link></li>
                                </>
                            )}

                        </ul>

                        {auth.user && (
                            <p className="navbar-text navbar-right">
                                Signed in as {auth.user.employee.firstName} {auth.user.employee.lastName}.
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