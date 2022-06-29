import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import AuthContext from '../AuthContext';

function Navbar() {
    const auth = useContext(AuthContext);
    console.log(auth);

    return (
        <>
            <ul>
                
                {auth.user.hasRole("ROLE_EMPLOYEE") && (
                    <>
                        <li><Link to="/">My Shifts</Link></li>
                        <li><Link to="/employee/availability">My Availability</Link></li>
                    </>
                )}

                {auth.user.hasRole("ROLE_MANAGER") && (
                        <li><Link to="/">Schedules</Link></li>
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