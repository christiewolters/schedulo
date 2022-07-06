
import React, { useState, useContext } from 'react';
import AuthContext from '../AuthContext';
import DisplayErrors from './DisplayErrors';
import { useHistory } from 'react-router-dom';

function Register() {
    const auth = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [wage, setWage] = useState(10);
    const [role, setRole] = useState("none")
    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();

        // Make sure that the user didn't make a mistake in entering their password.
        if (password !== confirmPassword) {
            setErrors(['your passwords don\'t match']);
            return;
        }

        const appUser = {
            username,
            password,
            role
        }

        const employee = {
            firstName,
            lastName,
            appUserId: userId,
            wage
        }

        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify(appUser)
        };


        async function createAppUser() {
            if (role === "none") {
                console.log(role);
                setErrors(["Role must be selected"]);
                return;
            }
            await fetch('http://localhost:8080/api/appuser', init)
                .then(response => {
                    if (response.status === 201) {
                        return response.json();
                    } else {
                        return Promise.reject(`Unexpected status code: ${response.status}`);
                    }
                })
                .then(data => {
                    if (data.appUserId) {
                        setUserId(data.appUserId);
                    }
                    else {
                        setErrors(data);
                    }
                }).catch(console.log);
        }

        const employeeInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify(employee)
        }

        async function createEmployee() {
            console.log(employee);
            if (role !== "none") {
                await fetch('http://localhost:8080/api/employees', employeeInit)
                    .then(response => {
                        if (response.status === 201) {
                            return response.json();
                        } else {
                            return Promise.reject(`Unexpected status code: ${response.status}`);
                        }
                    })
                    .then(data => {
                        if (!data.employeeId) {
                            setErrors(data);
                        }
                        else {
                            alert("Creation Successful");
                            history.push('/');
                        };
                    })
                    .catch(console.log);
            }
        }


        async function callCreates() {
            await createAppUser();
            await createEmployee();
        }

        callCreates();
    }



    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    return (
        <>
            <h3 className="blue text-center">Register a New Employee</h3>
            <div className="modal-dialog mt-0">
                <div className="modal-content pl-5">
                    <div className="modal-header">

                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} id="register_form">
                        <div className="row">
                            <div className="col-md-6 pt-4">
                                <input id="firstName" type="text" className="form-control" placeholder="First name"
                                    onChange={(event) => setFirstName(event.target.value)} value={firstName} />
                            </div>
                            <div className="col-md-6 pt-4">
                                <input id="lastName" type="text" className="form-control" placeholder="Last name"
                                    onChange={(event) => setLastName(event.target.value)} value={lastName} />
                            </div>
                        </div>
                        <div className="row pt-5">
                            <div className="col-xs-12">
                                <input id="username" type="text" className="form-control" placeholder="Username or email address"
                                    onChange={handleUsernameChange} value={username} />

                                <input id="password" type="password" className="form-control mt-4" placeholder="Password"
                                    onChange={(event) => setPassword(event.target.value)} value={password} />

                                <input id="confirmPassword" type="password" className="form-control mt-4" placeholder="Confirm password"
                                    onChange={(event) => setConfirmPassword(event.target.value)} value={confirmPassword} />
                            </div>
                        </div>
                        <div className="pt-5">
                            <p className="pb-2">Please select the type of employee:</p>
                            <div className="box">
                                <div className="radio inline pr-5">
                                    <label htmlFor="employee">Employee </label>
                                </div>
                                <input type="radio" id="employee" className="iradio_flat" name="role" value={role} onClick={(event) => setRole(event.target.value)} />

                            </div>

                            <div className="box  ml-5">
                                <div className="radio inline pr-5">
                                    <label htmlFor="manager">Manager </label>
                                </div>
                                <input type="radio" id="manager" className="iradio_flat" name="role" value={role} onClick={(event) => setRole(event.target.value)} />
                            </div>
                        </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                    {errors.size === 0 ? null : <DisplayErrors errors={errors} />}
                        <button type="submit" form="register_form" className="btn btn-primary">Register Employee</button>
                    </div>

                </div>

            </div>



            {/* <h2>Register an Employee</h2>
            {errors.size === 0 ? null : <DisplayErrors errors={errors} />}

            <div>
                <label htmlFor="role">Role: </label>
                <select id="role" onChange={(event) => setRole(event.target.value)} value={role}>
                    <option value="none" selected hidden>Select a Role</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="MANAGER">MANAGER</option>
                </select>
            </div>



            <div>
            </div>

            <div>
            </div>

            <div>
            </div>

            <div>
            </div>

            <div>
                <button type="submit">Register</button>
            </div> */}

        </>
    );
};

export default Register;