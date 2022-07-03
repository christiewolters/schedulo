
import React, { useState, useContext } from 'react';
import AuthContext from '../AuthContext';
import DisplayErrors from './DisplayErrors';
import {Link, useHistory } from 'react-router-dom';

function Register(){
    const auth = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [wage, setWage] = useState(0);
    const [role, setRole] = useState('')
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

       
        async function callCreates(){
         await createAppUser();
         await createEmployee();
        }
        
        callCreates();
    }



    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    return <>
    <h2>Register an Employee</h2>
    {errors.size === 0 ? null : <DisplayErrors errors={errors}/>}
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="role">Role: </label>
                <select id="role" onChange={(event) => setRole(event.target.value)} value={role}>
                    <option>EMPLOYEE</option>
                    <option>MANAGER</option>
                </select>
            </div>
            <div>
                <label htmlFor="username">Username:</label>
                <input id="username" type="text"
                    onChange={handleUsernameChange} value={username} />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input id="password" type="password"
                    onChange={(event) => setPassword(event.target.value)} value={password} />
            </div>

            <div>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input id="confirmPassword" type="password"
                    onChange={(event) => setConfirmPassword(event.target.value)} value={confirmPassword} />
            </div>
            <div>
                <label htmlFor="firstName">Employee First Name:</label>
                <input id="firstName" type="text"
                    onChange={(event) => setFirstName(event.target.value)} value={firstName} />
            </div>
            <div>
                <label htmlFor="lastName">Employee Last Name:</label>
                <input id="lastName" type="text"
                    onChange={(event) => setLastName(event.target.value)} value={lastName} />
            </div>
            <div>
                <label htmlFor="wage">Employee Wage:</label>
                <input id="wage" type="number"
                    onChange={(event) => setWage(parseInt(event.target.value))} value={wage} />
            </div>
            <div>
                <button type="submit">Register</button>
            </div>
        </form>
    </>
};

export default Register;