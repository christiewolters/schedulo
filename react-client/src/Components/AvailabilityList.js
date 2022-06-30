import date from 'date-and-time';
import { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from '../AuthContext';

function AvailabilityList() {
  const [availabilities, setAvailabilities] = useState([]);

  const auth = useContext(AuthContext);

  const history = useHistory();

  //helper method to make read strings into date objects (couldn't figure out how to do this with map)
  const convertToDate = (availabilities) => {
    for (let a of availabilities) {
      a.startTime = new Date(a.startTime);
      a.endTime = new Date(a.endTime);
    }
    return availabilities;
  }


  //get all
  useEffect(() => {
    fetch(`http://localhost:8080/api/availabilities/employee/${auth.employee.employeeId}`)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => convertToDate(data))
      .then(data => setAvailabilities(data))
      .catch(console.log);
  }, [auth.employee.employeeId]); // An empty dependency array tells to run our side effect once when the component is initially loaded. 


  //deletes to backend
  const handleDeleteAvail = (availabilityId) => {
    const availability = availabilities.find(availability => availability.id === availabilityId);

    if (window.confirm(`Delete solar panel ${availability.section}-${availability.row}-${availability.column}?`)) {
      const init = {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.user.token}`
        },
      };

      fetch(`http://localhost:8080/api/availabilities/${availabilityId}`, init)
        .then(response => {
          if (response.status === 204) {
            // create a copy of the solar panels array
            // remove the solar panel that we need to delete
            const newAvailabilities = availabilities.filter(availability => availability.id !== availabilityId);

            // update the solar panels state variable
            setAvailabilities(newAvailabilities);
          } else {
            return Promise.reject(`Unexpected status code: ${response.status}`);
          }
        })
        .catch(console.log);
    }
  };

  return (
    <>
      <h2 className="mb-4">Availability</h2>
      <button className="btn btn-primary my-4" onClick={() => history.push('/availabilities/add')}>
        <i className="bi bi-plus-circle"></i> Add Solar Panel
      </button>

      <table className="table table-striped table-hover table-sm">
        <thead className="thead-dark">
          <tr>
            <th>Date</th>
            <th>Start Time - End Time</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {availabilities.map(availability => (
            <tr key={availability.availabilityId}>
              <td>{date.format(availability.startTime, 'ddd, MMM D, YYYY')}</td>
              <td>{date.format(availability.startTime, 'h:mm A')} - {date.format(availability.endTime, 'h:mm A')}</td>
              <td>
                <div className="float-right mr-2">
                  <Link className="btn btn-primary btn-sm mr-2" to={`/availabilitiess/edit/${availability.id}`}>
                    <i className="bi bi-pencil-square"></i> Edit
                  </Link>
                  {auth.user && auth.user.hasRole('ROLE_ADMIN') && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAvail(availability.id)}>
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

export default AvailabilityList;