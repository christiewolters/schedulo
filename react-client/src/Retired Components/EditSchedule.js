import date from 'date-and-time';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useEffect, useState, useContext, useLayoutEffect } from 'react';
import AuthContext from '../AuthContext';

function EditSchedule() {
    const auth = useContext(AuthContext);

    //Extract scheduleId from browser path
    const { scheduleId } = useParams();
    const [schedule, setSchedule] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [isLoaded, setIsLoaded] = useState([]);

    let dateList = [];
    const [errors, setErrors] = useState([]);

    //Add form
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');


    useEffect(() => {
        const init = async () => {
            const getScheduleRes = await getSchedule();
            setSchedule(getScheduleRes);
            console.log(schedule);
            const getEmployeeRes = await getEmployees();
            setEmployees(getEmployeeRes);
            console.log(employees);
            const getAvailabilitiesRes = await getAvailabilities();
            setAvailabilities(getAvailabilitiesRes);
            console.log(availabilities);
            const getShiftsRes = await getShifts();
            setShifts(getShiftsRes);
            console.log(shifts);
        }
        init();
        setIsLoaded(true);
        console.log("done");
        loadTable();
    }, [])

    const getSchedule = async () => {
        if (!scheduleId) { return; }

        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };

        const response = await fetch(`http://localhost:8080/api/schedules/${scheduleId}`, init);
        if (response.status == 200) {
            console.log("got a 200 status");
            return response.json();
        } else {
            console.log("Did not get a status in schedule");
            return Promise.reject(`Unexpected status code: ${response.status}`);
        }
    }

    const getEmployees = async () => {

        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };

        const response = await fetch(`http://localhost:8080/api/employees`, init);
        if (response.status == 200) {
            console.log("got a 200 status");
            return response.json();
        } else {
            console.log("Did not get a status in employees");
            return Promise.reject(`Unexpected status code: ${response.status}`);
        }
    }

    const getAvailabilities = async () => {

        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };

        const response = await fetch(`http://localhost:8080/api/availabilities`, init);
        if (response.status == 200) {
            console.log("got a 200 status");
            return response.json();
        } else {
            console.log("Did not get a status in availabilities");
            return Promise.reject(`Unexpected status code: ${response.status}`);
        }
    }

    const getShifts = async () => {
        if (!scheduleId) { return; }

        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };

        const response = await fetch(`http://localhost:8080/api/shifts/schedule/${scheduleId}`, init);
        if (response.status == 200) {
            console.log("got a 200 status");
            const newData = await response.json();
            const withObjects = newData.map(shift => {
                shift.startTime = new Date(shift.startTime);
                shift.endTime = new Date(shift.endTime);
                return shift;
            })
            return withObjects;
        } else {
            console.log("Did not get a status in shifts");
            return Promise.reject(`Unexpected status code: ${response.status}`);
        }
    }

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
        if (schedule === null || shifts === null || employees.length === 0) {
            console.log("Couldn't load.");
            return;
        }
        console.log("got past if");
        //sets min and max values to form elements
        adjustDates();

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
                let currShifts = shifts.filter(shift => shift.employeeId === employee.employeeId && date.isSameDay(currDate, new Date(shift.startTime)))
                    .sort((a, b) => a.startTime - b.startTime);
                for (let i = 0; i < currShifts.length; i++) {
                    if (i > 0) { bodyHtml += `<br/>`; }
                    bodyHtml += `${date.format(currShifts[i].startTime, 'h:mm A')} - ${date.format(currShifts[i].endTime, 'h:mm A')}`;
                    bodyHtml += `
                    <button type="button" className="remove-btn-icon pr-4" onClick="handleDeleteShift(${currShifts[i].shiftId})">
                    <i className="glyphicon glyphicon-trash"></i>
                </button>`;
                }
                bodyHtml += "</td>";
            }
            bodyHtml += "</tr>";
        }
        tableBody.innerHTML = bodyHtml;
    }


    async function loadPage() {
        await getSchedule();
        console.log("schedule : " + JSON.stringify(schedule));
        await getShifts();
        console.log("shifts : " + JSON.stringify(shifts));
        await getEmployees();
        console.log("employees : " + employees);
        await getAvailabilities();
        console.log("availabilities : " + availabilities);
        console.log("Done");
    }





    //Select Employee options on add
    useEffect(() => {
        console.log("entered employee selector. StartTime : " + startTime + " EndTime : " + endTime);
        const selectList = document.getElementById('employeeIdForm');
        let html = `<option value="" disabled selected>Select an employee</option>`;
        let selectEmployees = [];
        let selectAvailabilities = [];


        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };
        fetch(`http://localhost:8080/api/employees`, init)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected status code: ${response.status}`);
                }
            })
            .then(employeedata => {
                selectEmployees = employeedata;

                fetch(`http://localhost:8080/api/availabilities`, init)
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return Promise.reject(`Unexpected status code: ${response.status}`);
                        }
                    })
                    .then(availdata => {
                        selectAvailabilities = availdata;
                        console.log("select ranges: " + startTime + " - " + endTime);
                        let whoAvail = selectAvailabilities.filter(a => ((new Date(a.startTime) <= new Date(startTime)) && (new Date(endTime) <= new Date(a.endTime))));
                        console.log("whoAvail" + JSON.stringify(whoAvail));
                        let availHtml = "";
                        let unavailHtml = "";
                        for (const employee of selectEmployees) {

                            if (whoAvail.map(a => a.employeeId).includes(employee.employeeId)) {
                                availHtml += `<option value="${employee.employeeId}">${employee.firstName} ${employee.lastName}</option>`;
                            }
                            else {
                                unavailHtml += `<option value="${employee.employeeId}">${employee.firstName} ${employee.lastName}</option>`;
                            }

                        }
                        if (availHtml) {
                            html += '<optgroup label="available">' + availHtml + '</optgroup>';
                        }

                        if (unavailHtml) {
                            html += '<optgroup label="unavailable">' + unavailHtml + '</optgroup>';
                        }

                        selectList.innerHTML = html;
                    })
                    .catch(console.log);
            })
            .catch(console.log);
    }, [startTime, endTime])

    //update min and max values on calendar
    function adjustDates() {
        if (!schedule || !schedule.startDate || !schedule.endDate) { return; }
        const formStartTime = document.getElementById('formStartTime');
        const formEndTime = document.getElementById('formEndTime');
        formStartTime.setAttribute("min", schedule.startDate + "T00:00:00");
        formEndTime.setAttribute("min", schedule.startDate + "T00:00:00");
        formStartTime.setAttribute("max", schedule.endDate + "T23:59:59");
        formEndTime.setAttribute("max", schedule.endDate + "T23:59:59");
    };

    //add
    const handleAdd = (event) => {
        event.preventDefault();

        const form = document.getElementById('addForm');
        const formData = new FormData(form);

        const shift = {
            employeeId: formData.get('employeeIdForm'),
            startTime: startTime,
            endTime: endTime,
            scheduleId: scheduleId,
            earned: "a"
        }
        console.log(JSON.stringify(shift));

        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify(shift)
        };

        fetch('http://localhost:8080/api/shifts', init)
            .then(response => {
                if (response.status === 201 || response.status === 400) {
                    return response.json();
                } else {
                    setErrors(["All fields are required."]);
                    return Promise.reject(`Unexpected status code: ${response.status}`);
                }
            })
            .then(data => {
                if (data.shiftId) {
                    console.log(JSON.stringify(data));
                    //TODO: display success message
                    //TODO: RELOAD DATA ON PAGE (should automatically happen if availabilities changes)
                    shifts.push(data);
                    clearForm();
                } else {
                    //unhappy path
                    console.log("after add" + data);
                    setErrors(data);
                    console.log("errors: " + errors);
                }
            })
            .catch(console.log);
    };


    function clearForm() {
        const formStartTime = document.getElementById('formStartTime');
        const formEndTime = document.getElementById('formEndTime');
        const employeeIdForm = document.getElementById('employeeIdForm');
        formStartTime.value = "";
        formEndTime.value = "";
        employeeIdForm.value = null;
        setStartTime('');
        setEndTime('');
    }

    //delete
    const handleDeleteShift = (shiftId) => {
        alert("Called handleDeleteShift");
    }

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
                    <label htmlFor="formStartTime">Starting:</label>
                    <input type="datetime-local" className="form-control inline" id="formStartTime" name="formStartTime" onChange={(event) => { setStartTime(event.target.value); adjustDates(); }} required></input>
                    <label htmlFor="formEndTime">Finishing:</label>
                    <input type="datetime-local" className="form-control inline" id="formEndTime" name="formEndTime" onChange={(event) => { setEndTime(event.target.value); adjustDates(); }} required></input>
                    <label htmlFor="employeeIdForm">Employee:</label>
                    <select id="employeeIdForm" name="employeeIdForm" required></select>


                    <button className="blue largebutton" onClick={handleAdd}>Add Shift</button>
                </fieldset>
            </form>

            <table className="table">
                <thead>
                    <tr id="tableHead">
                    </tr>
                </thead>
                <tbody id="tableBody">

                </tbody>



            </table>
            <button type="button" className="btn btn-info btn-block">Publish</button>
            <button type="button" className={schedule.finalized ? "btn btn-info btn-block disabled" : "btn btn-info btn-block"}>Publish</button>


        </>
    );
}

export default EditSchedule;