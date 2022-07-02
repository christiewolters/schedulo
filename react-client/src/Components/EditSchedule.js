import date from 'date-and-time';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../AuthContext';

function EditSchedule() {
    const auth = useContext(AuthContext);

    const [employees, setEmployees] = useState([]);
    const [schedule, setSchedule] = useState(null);

    //Extract scheduleId from browser path
    const { scheduleId } = useParams();
    console.log("scheduleId : " + scheduleId);


    //FIRST, get scheduling dates using id in the browser path
    useEffect(() => {
        //Make sure we have an id value
        if(scheduleId){
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
    }, [scheduleId]);

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
    }, []);

    console.log("employees : " + employees);

    //Converts dates in schedule to a list of each weekday/date
    const dateList = (schedule) => {
        let dateArray = [];
        let thisDay = new Date(schedule.startDate);
        console.log("start date: " + thisDay);
        while(thisDay <= new Date(schedule.endDate)){
            dateArray.push(thisDay);
            let newDate = thisDay.setDate(thisDay.getDate() + 1);
            thisDay = new Date(newDate);
            console.log("thisDay : " + thisDay);
        }
        console.log("dateArray: " + JSON.stringify(dateArray));
        return dateArray;
    };


        //THIRD, get employee shifts
        const getEmployeeShifts = (employee) => {
            const init = {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                },
            };

            fetch(`http://localhost:8080/api/shifts/schedule/${scheduleId}/${employee.employeeId}`, init)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected status code: ${response.status}`);
                }
            })
            .then(data => {
                if(!data){return null;}
            })
            .catch(console.log);
        }
    
        
    

    return (
        <>
            <h3 className="text-center">Edit Schedule</h3>


            <table>
                <thead>
                    <tr>
                        <th>Employees</th>
                        {schedule && 
                        dateList(schedule).map(thisDate =>(
                            <th key={JSON.stringify(thisDate)}>{date.format(thisDate, 'ddd, MMM D, YYYY')}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employees &&
                    employees.map( employee => (
                        <tr key={employee.employeeId}>
                            <td>{employee.firstName} {employee.lastName}</td>

                            {getEmployeeShifts(employee).map( shift => (
                                <td>{shift.startTime}</td>
                            )
                            )}

                            
                        </tr>
                    ))}
                </tbody>



            </table>









        </>
    );
}

export default EditSchedule;