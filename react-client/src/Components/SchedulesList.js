import { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from '../AuthContext';

function SchedulesList() {
  const [schedules, setSchedules] = useState([]);

  const auth = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    fetch('http://localhost:8080/api/schedules')
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => setSchedules(data))
      .catch(console.log);
  }, []); // An empty dependency array tells to run our side effect once when the component is initially loaded.    


    //TEMPORTY FILLER CODE FOR DUMMY DATA
    const dummySchedules = [
        {},
        {},
        {}
    ];



  const handleDeleteSchedule = (scheduleId) => {
    const schedule = schedules.find(schedule => schedule.id === scheduleId);

    if (window.confirm(`Delete schedule ${schedule.startDate}-${schedule.endDate}?`)) {
      const init = {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.user.token}`
        },
      };

      fetch(`http://localhost:8080/api/schedules/${scheduleId}`, init)
        .then(response => {
          if (response.status === 204) {
            // create a copy of the schedules array
            // remove the schedule that we need to delete
            const newSchedules = schedules.filter(schedule => schedule.id !== scheduleId);

            // update the schedules state variable
            setSchedules(newSchedules);
          } else {
            return Promise.reject(`Unexpected status code: ${response.status}`);
          }
        })
        .catch(console.log);
    }
  };

  return (
    <>


            <div className="list-group">
              <a href="#" className="list-group-item active">Cras justo odio</a>
              <a href="#" className="list-group-item">Dapibus ac facilisis in</a>
              <a href="#" className="list-group-item">Morbi leo risus</a>
              <a href="#" className="list-group-item">Porta ac consectetur ac</a>
              <a href="#" className="list-group-item">Vestibulum at eros</a>
              <a href="#" className="list-group-item"><span className="badge badge-primary">38</span>Morbi leo risus</a>
            </div>



      <h2 className="mb-4">Schedules</h2>

      <button className="btn btn-primary my-4" onClick={() => history.push('/schedules/add')}>
        <i className="bi bi-plus-circle"></i> Add Schedule
      </button>

      <table className="table table-striped table-hover table-sm">
        <thead className="thead-dark">
          <tr>
            <th>Section</th>
            <th>Row-Column</th>
            <th>Year Installed</th>
            <th>Material</th>
            <th>Is Tracking?</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {solarPanels.map(solarPanel => (
            <tr key={solarPanel.id}>
              <td>{solarPanel.section}</td>
              <td>{solarPanel.row}-{solarPanel.column}</td>
              <td>{solarPanel.yearInstalled}</td>
              <td>{solarPanel.material}</td>
              <td>{solarPanel.tracking ? 'Yes' : 'No'}</td>
              <td>
                <div className="float-right mr-2">
                  <Link className="btn btn-primary btn-sm mr-2" to={`/solarpanels/edit/${solarPanel.id}`}>
                    <i className="bi bi-pencil-square"></i> Edit
                  </Link>
                  {auth.user && auth.user.hasRole('ROLE_ADMIN') && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletePanel(solarPanel.id)}>
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default SchedulesList;