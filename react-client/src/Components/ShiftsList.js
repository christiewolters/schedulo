import date from 'date-and-time';
import { useEffect, useState, useContext } from 'react';

import AuthContext from '../AuthContext';

function EmployeeShiftList() {
  const [shifts, setShifts] = useState([]);

  const auth = useContext(AuthContext);

  useEffect(() => {
    const init = {
      headers: {
        'Authorization': `Bearer ${auth.user.token}`
      },
    };
    fetch('http://localhost:8080/api/shifts/user', init)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => {
        let sortedArr = data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        setShifts(sortedArr);
      })
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
    <>
    <h3 className="blue">Shifts</h3>
    <section className="panel transparent">
      <table className="table table-hover table-sm">
        <thead>
          <tr>
            <th className="width-33percent gray-text">Date</th>
            <th className="width-33percent text-center gray-text">Start</th>
            <th className="width-33percent text-center gray-text">End</th>
          </tr>
        </thead>
        <tbody>
          {shifts.filter(s => new Date(s.endTime) >= new Date()).length ? 
          shifts.filter(s => new Date(s.endTime) >= new Date())
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
          .map(shift => (
            <tr key={shift.shiftId} className={(new Date(shift.startTime) < new Date()) ? "" : ""}>
              <td>{getDay(shift.startTime)}</td>
              <td className="text-center">{dateFormat(shift.startTime)}</td>
              <td className="text-center">{dateFormat(shift.endTime)}</td>
            </tr>
          )) : (<tr><td colSpan="3" className="text-center">You have no upcoming shifts to display.</td></tr>)}

        </tbody>
      </table>

      <div className="panel-group panel-group-lists collapse in" id="accordion2" style={{}}>
        <div className="panel">
          <div className="panel-heading">
            <h4 className="panel-title">
              <button data-toggle="collapse" data-parent="#accordion2" href="#collapseFour" className="collapsed btn btn-block">
                <strong>Past Shifts</strong>
              </button>
            </h4>
          </div>
          <div id="collapseFour" className="panel-collapse collapse" style={{ height: "0px" }}>
            <div className="">
              

            <table className="table table-hover table-sm">
        <tbody>
          {shifts.filter(s => new Date(s.endTime) < new Date()).length ? shifts.filter(s => new Date(s.endTime) < new Date()).map(shift => (
            <tr key={shift.shiftId} className={(new Date(shift.startTime) < new Date()) ? "gray" : ""}>
              <td className="width-33percent">{getDay(shift.startTime)}</td>
              <td className="width-33percent text-center">{dateFormat(shift.startTime)}</td>
              <td className="width-33percent text-center">{dateFormat(shift.endTime)}</td>
            </tr>
          )) : (<tr><td>You have no shifts to display.</td></tr>)}

        </tbody>
      </table>


            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default EmployeeShiftList;