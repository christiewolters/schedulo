import date from 'date-and-time';
import { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from '../AuthContext';

function AvailabilityList() {
  const [availabilities, setAvailabilities] = useState([]);

  const auth = useContext(AuthContext);

  const history = useHistory();


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
      .then( data => data.map( a => {a.startTime = new Date(a.startTime); a.endTime = new Date(a.endTime); return a;} ))
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
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAvail(availability.id)}>
                      <i className="bi bi-trash"></i> Delete
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  Delete Availability Model
</button>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">

      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h5 class="modal-title" id="exampleModalLabel">Delete this availability?</h5>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger">Delete</button>
      </div>
    </div>
  </div>
</div>



<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addModal">
  Add Availability Model
</button>

<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">

      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h5 class="modal-title" id="addModalLabel">Add Availability</h5>
      </div>
      <div class="modal-body">
        <form>
          <label>Start Time</label>
          <input type="date"></input>
          <label>end Time</label>
          <input type="date"></input>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-success">Add</button>
      </div>
    </div>
  </div>
</div>


    </>
  );
}

export default AvailabilityList;