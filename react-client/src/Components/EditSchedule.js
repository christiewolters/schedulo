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
    let dateList = [];



    async function functionName() {
        await getSchedule();
        console.log("schedule : " + JSON.stringify(schedule));
        await getShifts();
        console.log("shifts : " + JSON.stringify(shifts));
        await getEmployees();
        console.log("employees : " + employees);
        console.log("Done");
        loadTable();
    }

    functionName().then(console.log("Actually done."));

    // useEffect(() => {
    //     getSchedule()
    //         .then(console.log("schedule : " + JSON.stringify(schedule)))
    //         .then(makeDateList())
    //         .then(console.log("dateList: " + JSON.stringify(dateList)))
    //         .then(getShifts())
    //         .then(console.log("shifts : " + JSON.stringify(shifts)))
    //         .then(getEmployees())
    //         .then(console.log("employees : " + employees))
    //         .then(loadTable())
    //         .catch(
    //             console.log("didn't work")
    //         );
    // }, [scheduleId]);

    // useEffect(() => {
    //     getShifts()
    //         .then(loadTable())
    // }, [shifts.length])


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
                .then(data => {makeDateList(data)})
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


    function loadTable() {
        console.log("entered loadTable");
        if( schedule === null || shifts.lenth === 0 || employees.length === 0 ){
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
        for(const employee of employees){
            bodyHtml += `<tr><td>${employee.firstName} ${employee.lastName}</td>`;

            for(const currDate of dates){
                bodyHtml += "<td>";
                let currShifts = shifts.filter(shift => shift.employeeId === employee.employeeId && date.isSameDay(currDate, new Date(shift.startTime)));
                for(const thisShift of currShifts){
                    bodyHtml += `${date.format(thisShift.startTime, 'h:mm A')} - ${date.format(thisShift.endTime, 'h:mm A')}`;
                }
                bodyHtml += "</td>";
            }
            bodyHtml += "</tr>";
        }
        tableBody.innerHTML = bodyHtml;
    }




    //SECOND, get a list of all employees at the company
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



    // //DISPLAY on the page
    // const renderShifts = (employee) => {
    //     let employeeId = employee.employeeId;
    //     console.log("rendering...");
    //     const tableRow = document.getElementById("employee" + employeeId);
    //     if (tableRow === null) { return; }
    //     let html = `<td>{employee.firstName} {employee.lastName}</td>`;
    //     let thisEmployeeShifts = shifts.filter(shift => shift.employeeId = employeeId);
    //     let somedates = dateList(schedule);
    //     console.log("somedates : " + somedates);
    //     console.log("somedates again : " + JSON.stringify(somedates));
    //     for (const currDate of somedates) {
    //         console.log(currDate instanceof Date);
    //         console.log(currDate);
    //         html += "<td>";
    //         let shifts = thisEmployeeShifts.filter(shift => date.isSameDay(currDate, new Date(shift.startTime)));
    //         for (const s of shifts) {

    //             html += `${date.format(s.startTime, 'h:mm A')} - ${date.format(s.endTime, 'h:mm A')}`;

    //         }
    //         html += "</td>";
    //     }
    //     tableRow.innerHTML = html;
    // }

    // function testFunction(event){
    //     console.log("Running test function");
    //     getShiftsByEmployee(6).then(shifts => (
    //         shifts.map();
    //     ));
    // }

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



    return (
        <>
            <h3 className="text-center">Edit Schedule</h3>

            <table>
                <thead>
                    <tr id="tableHead">
                        <th>Employees</th>
                        {/* {schedule &&
                            dateList(schedule).map(thisDate => (
                                <th key={JSON.stringify(thisDate)}>{date.format(thisDate, 'ddd, MMM D, YYYY')}</th>
                            ))} */}
                    </tr>
                </thead>
                <tbody id="tableBody">
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