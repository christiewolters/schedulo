import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import AuthContext from '../AuthContext';

function Navbar() {
    const auth = useContext(AuthContext);
    console.log(auth);

    return (
        <>
            <ul>
                <li><Link to="/">home</Link></li>
                <li><Link to='/manager'>manager page</Link></li>
                <li><Link to='/employee'>employee page</Link></li>
                {auth.user && (
                    <>
                        <li>{auth.user.username}</li>
                        <li><button onClick={() => auth.logout()}>Logout</button></li>
                    </>
                )}
            </ul>
        </>
    );
}

export default Navbar;