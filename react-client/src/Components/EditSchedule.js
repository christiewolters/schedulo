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
        loadTable();
    }
    loadPage().then(console.log("Actually done."));



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
                .then(data => { schedule = data; return data; })
                .then(data => { makeDateList(data); return data; })
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
            .then(data => { employees = data })
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
                        let whoAvail = selectAvailabilities.filter(a =>((new Date(a.startTime) <= new Date(startTime)) && (new Date(endTime) <= new Date(a.endTime))));
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
                        if(availHtml){
                            html += '<optgroup label="available">' + availHtml + '</optgroup>';
                        }

                        if(unavailHtml){
                            html += '<optgroup label="unavailable">' + unavailHtml + '</optgroup>';
                        }

                        selectList.innerHTML = html;
                    })
                    .catch(console.log);
            })
            .catch(console.log);
    }, [startTime, endTime])



//add
  const handleAdd = (event) => {
    event.preventDefault();

    const form = document.getElementById('addForm');
    const formData = new FormData(form);

    const shift = {
        employeeId: formData.get('employeeIdForm'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      scheduleId : scheduleId,
      earned : "a"
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

        } else {
          //unhappy path
          console.log("after add" + data);
          setErrors(data);
          console.log("errors: " + errors);
        }
      })
      .catch(console.log);
  };

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
                    <input type="datetime-local" className="form-control inline" id="startTime" name="startTime" onChange={(event) => setStartTime(event.target.value)} required></input>
                    <label htmlFor="endTime">Finishing:</label>
                    <input type="datetime-local" className="form-control inline" id="endTime" name="endTime" onChange={(event) => setEndTime(event.target.value)} required></input>
                    <label htmlFor="employeeIdForm">Employee:</label>
                    <select id="employeeIdForm" name="employeeIdForm" required></select>


                    <button className="blue largebutton" onClick={handleAdd}>Add Shift</button>
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