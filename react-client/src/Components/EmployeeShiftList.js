import date from 'date-and-time';
import { useEffect, useState, useContext } from 'react';

import AuthContext from '../AuthContext';

function EmployeeShiftList() {
  const [shifts, setShifts] = useState([]);

  const auth = useContext(AuthContext);

  useEffect(() => {
    const init = {
      headers: {
        'Authorization' : `Bearer ${auth.user.token}`
      },
    };
    fetch(`http://localhost:8080/api/shifts/user/${auth.user.username}`, init)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => setShifts(data))
      .catch(console.log);
  }, [auth.user]);

  const dateFormat = (time) => {
    let newdate = new Date(time);
    return date.format(newdate, 'h:mm A');
  }

  const getDay = (time) => {
    let newdate = new Date(time);
    return date.format(newdate, 'dddd, MMM D');
  }

  return (
    <section className="panel panel-default">
      <div className="panel-heading">
        <h4 className="m-0 p-0">Upcoming Shifts</h4>
      </div>
      <table className="table table-hover table-sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {shifts ? shifts.map(shift => (
            <tr key={shift.shiftId}>
              <td>{getDay(shift.startTime)}</td>
              <td>{dateFormat(shift.startTime)}</td>
              <td>{dateFormat(shift.endTime)}</td>
            </tr>
          )) : (<tr>You have no shifts to display.</tr>)}

        </tbody>
      </table>
    </section>
  );
}

export default EmployeeShiftList;