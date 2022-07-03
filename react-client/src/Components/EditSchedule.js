import date from 'date-and-time';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../AuthContext';

function EditSchedule() {
    const auth = useContext(AuthContext);

    //Extract scheduleId from browser path
    const { scheduleId } = useParams();

    let schedule = null;
    let employees = [];
    let shifts = [];
    let availabilities = [];
    let dateList = [];
    const [errors, setErrors] = useState([]);

    //Add form
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [availableEmployees, setAvailableEmployees] = useState([]);


    async function functionName() {
        await getSchedule();
        console.log("schedule : " + JSON.stringify(schedule));
        await getShifts();
        console.log("shifts : " + JSON.stringify(shifts));
        await getEmployees();
        console.log("employees : " + employees);
        await getAvailabilities();
        console.log("availabilities : " + availabilities);
        console.log("Done");
        loadTable();
    }
    functionName().then(console.log("Actually done."));



    //FIRST, get scheduling dates using id in the browser path
    async function getSchedule() {
        //Make sure we have an id value
        if (scheduleId) {
            const init = {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                },
            };
            await fetch(`http://localhost:8080/api/schedules/${scheduleId}`, init)
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        return Promise.reject(`Unexpected status code: ${response.status}`);
                    }
                })
                .then(data => { schedule = data })
                .then(data => { makeDateList(data) })
                .catch(console.log);
        }
    };

    //Converts dates in schedule to a list of each weekday/date
    function makeDateList(name) {
        let dateArray = [];
        let thisDay = new Date(name.startDate);
        while (thisDay <= new Date(name.endDate)) {
            dateArray.push(thisDay);
            let newDate = thisDay.setDate(thisDay.getDate() + 1);
            thisDay = new Date(newDate);
        }
        dateList = dateArray;
        return dateArray;
    };

    //Builds and displays HTML data
    function loadTable() {
        console.log("entered loadTable");
        if (schedule === null || shifts.lenth === 0 || employees.length === 0) {
            console.log("Couldn't load.");
            return;
        }
        const tableHead = document.getElementById("tableHead");
        let headHtml = "<th>Employees</th>";
        const dates = makeDateList(schedule);
        console.log("dates: " + JSON.stringify(dates));
        for (const currDate of dates) {
            headHtml += `<th>${date.format(currDate, 'ddd, MMM D, YYYY')}</th>`;
        }
        tableHead.innerHTML = headHtml;


        const tableBody = document.getElementById("tableBody");
        let bodyHtml = "";
        for (const employee of employees) {
            bodyHtml += `<tr><td>${employee.firstName} ${employee.lastName}</td>`;

            for (const currDate of dates) {
                bodyHtml += "<td>";
                let currShifts = shifts.filter(shift => shift.employeeId === employee.employeeId && date.isSameDay(currDate, new Date(shift.startTime)));
                for (const thisShift of currShifts) {
                    bodyHtml += `${date.format(thisShift.startTime, 'h:mm A')} - ${date.format(thisShift.endTime, 'h:mm A')}`;
                }
                bodyHtml += "</td>";
            }
            bodyHtml += "</tr>";
        }
        tableBody.innerHTML = bodyHtml;
    }




    //Get a list of all employees at the company
    async function getEmployees() {
        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };
        await fetch(`http://localhost:8080/api/employees`, init)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected status code: ${response.status}`);
                }
            })
            .then(data => employees = data)
            .catch(console.log);
    };


    //Get a list of all availabilities
    async function getAvailabilities() {
        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };
        await fetch(`http://localhost:8080/api/availabilities`, init)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected status code: ${response.status}`);
                }
            })
            .then(data => availabilities = data)
            .catch(console.log);
    };



    //THIRD, get a list of all shifts for the schedule
    async function getShifts() {
        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };
        await fetch(`http://localhost:8080/api/shifts/schedule/${scheduleId}`, init)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected status code: ${response.status}`);
                }
            })
            .then(data => data.map(shift => {
                shift.startTime = new Date(shift.startTime);
                shift.endTime = new Date(shift.endTime);
                return shift;
            }))
            .then(data => shifts = data)
            .catch(console.log);
    };


    //Select Employee options on add
    useEffect(() => {
        const selectList = document.getElementById('employeeIdForm');
        let html = "";
        let whoAvail = availabilities.filter(a => 
            (new Date(a.startTime) <= new Date(startTime)) && (new Date(a.endTime) <= new Date(endTime))
        );
        for (const employee of employees) {
            html +=`<option value='${employee.employee.id} '`;
            if( whoAvail.map(a => a.employeeId).includes(employee.employeeId) ){
                html += `className="grayed-out" `;
            }
            html += `>${employee.firstName} ${employee.lastName}</option>`;
        }
    },[startTime, endTime])


    return (
        <>
            <h3 className="text-center">Edit Schedule</h3>

            {errors.length > 0 &&
                <div className="alert alert-danger">
                    <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <strong>Oh snap! We couldn't do that! </strong>{errors.map(error => (<span key={error}>
                        {error}. </span>
                    ))}
                </div>
            }

            <form id="addForm">
                <fieldset><legend>Add Shift</legend>
                    <label htmlFor="startTime">Starting:</label>
                    <input type="datetime-local" className="form-control inline" id="startTime" name="startTime" onChange={(event) => setStartTime(event.target.value)}></input>
                    <label htmlFor="endTime">Finishing:</label>
                    <input type="datetime-local" className="form-control inline" id="startTime" name="startTime" onChange={(event) => setEndTime(event.target.value)}></input>
                    <label htmlFor="employeeIdForm">Employee:</label>
                    <select id="employeeIdForm" name="employeeIdForm" value="employee">
                    </select>




                    <button className="blue largebutton" onClick="">Register</button>
                </fieldset>
            </form>

            <table>
                <thead>
                    <tr id="tableHead">
                    </tr>
                </thead>
                <tbody id="tableBody">

                </tbody>



            </table>
        </>
    );
}

export default EditSchedule;