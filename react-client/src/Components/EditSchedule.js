import date from 'date-and-time';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../AuthContext';

function EditSchedule() {
    const auth = useContext(AuthContext);

    const [employees, setEmployees] = useState([]);
    const [schedule, setSchedule] = useState(null);
    const [shifts, setShifts] = useState([]);

    //Extract scheduleId from browser path
    const { scheduleId } = useParams();
    console.log("scheduleId : " + scheduleId);


    //FIRST, get scheduling dates using id in the browser path
    useEffect(() => {
        //Make sure we have an id value
        if (scheduleId) {
            const init = {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                },
            };
            fetch(`http://localhost:8080/api/schedules/${scheduleId}`, init)
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        return Promise.reject(`Unexpected status code: ${response.status}`);
                    }
                })
                .then(data => { setSchedule(data) })
                .catch(console.log);
        }
    }, [scheduleId, auth.user.token]);

    console.log("schedule : " + JSON.stringify(schedule));


    //SECOND, get a list of all employees at the company
    useEffect(() => {
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
            .then(data => setEmployees(data))
            .catch(console.log);
    }, [auth.user.token]);

    console.log("employees : " + employees);

    //Converts dates in schedule to a list of each weekday/date
    const dateList = (schedule) => {
        let dateArray = [];
        let thisDay = new Date(schedule.startDate);
        while (thisDay <= new Date(schedule.endDate)) {
            dateArray.push(thisDay);
            let newDate = thisDay.setDate(thisDay.getDate() + 1);
            thisDay = new Date(newDate);
        }
        console.log("dateArray: " + JSON.stringify(dateArray));
        return dateArray;
    };

    //THIRD, get a list of all shifts for the schedule
    useEffect(() => {
        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };
        fetch(`http://localhost:8080/api/shifts/schedule/${scheduleId}`, init)
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
            .then(data => setShifts(data))
            .catch(console.log);
    }, [auth.user.token, scheduleId]);

    console.log("shifts : " + JSON.stringify(shifts));

    //DISPLAY on the page
    const renderShifts = (employee) => {
        let employeeId = employee.employeeId;
        console.log("rendering...");
        const tableRow = document.getElementById("employee" + employeeId);
        if(tableRow === null){return;}
        let html = `<td>{employee.firstName} {employee.lastName}</td>`;
        let thisEmployeeShifts = shifts.filter(shift => shift.employeeId = employeeId);
        let somedates = dateList(schedule);
        console.log("somedates : " + somedates);
        console.log("somedates again : " + JSON.stringify(somedates));
        for (const currDate of somedates){
            console.log(currDate instanceof Date);
            console.log(currDate);
            html += "<td>";
            let shifts = thisEmployeeShifts.filter(shift => date.isSameDay(currDate, new Date(shift.startTime)));
            for (const s of shifts ) {

                html += `${date.format(s.startTime, 'h:mm A')} - ${date.format(s.endTime, 'h:mm A')}`;

            }
            html += "</td>";
        }
        tableRow.innerHTML = html;
    }

    // function testFunction(event){
    //     console.log("Running test function");
    //     getShiftsByEmployee(6).then(shifts => (
    //         shifts.map();
    //     ));
    // }

    // /*Get Agents from server*/
    // function getShiftsByEmployee(employeeId) {
    //     console.log("employee id : " + employeeId);
    //     let url = `http://localhost:8080/api/shifts/schedule/${scheduleId}/${employeeId}`;
    //     const init = {
    //         method: "GET",
    //         headers: {
    //             'Authorization': `Bearer ${auth.user.token}`
    //         }
    //     };
    //     return fetch(url, init)
    //         .then(response => {
    //             if (response.status === 200) {
    //                 return response.json();
    //             }
    //         }).then(data => {
    //             if(!data) { console.log("shift list not found");
    //                 return ["not found"];}
    //         })
    //         .catch(console.log);
    // }

    // //THIRD, get employee shifts
    // const getEmployeeShifts = (employee) => {
    //     const init = {
    //         headers: {

    //         },
    //     };

    //     fetch(`http://localhost:8080/api/shifts/schedule/${scheduleId}/${employee.employeeId}`, init)
    //         .then(response => {
    //             if (response.status === 200) {
    //                 return response.json();
    //             } else {
    //                 return Promise.reject(`Unexpected status code: ${response.status}`);
    //             }
    //         })
    //         .then(data => {
    //             if (!data) { return null; }
    //         })
    //         .catch(console.log);
    // }

    async function functionName() {


        
    }

    return (
        <>
            <h3 className="text-center">Edit Schedule</h3>

            <table>
                <thead>
                    <tr>
                        <th>Employees</th>
                        {/* {schedule &&
                            dateList(schedule).map(thisDate => (
                                <th key={JSON.stringify(thisDate)}>{date.format(thisDate, 'ddd, MMM D, YYYY')}</th>
                            ))} */}
                    </tr>
                </thead>
                <tbody>
                    {/* {employees &&
                        employees.map(employee => (
                            <tr id={"employee" + employee.employeeId} key={employee.employeeId}></tr>
                        ))
                    }

                    {shifts &&
                        shifts.map(shift => (
                            <tr key={shift.shiftId}>
                                <td>{shift.startTime.toString()} {shift.endTime.toString()}</td>
                            </tr>
                        ))
                    } */}

                </tbody>



            </table>









        </>
    );
}

export default EditSchedule;