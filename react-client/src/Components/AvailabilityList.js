import date from 'date-and-time';
import { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from '../AuthContext';
import DisplayErrors from './DisplayErrors';



function AvailabilityList() {


  const [availabilities, setAvailabilities] = useState([]);
  const [errors, setErrors] = useState([]);

  const auth = useContext(AuthContext);

  const history = useHistory();


  //get all
  useEffect(() => {
    const init = {
      headers: {
        'Authorization': `Bearer ${auth.user.token}`
      },
    };
    fetch(`http://localhost:8080/api/availabilities/employee/${auth.user.employee.employeeId}`, init)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => data.map(a => {
        a.startTime = new Date(a.startTime);
        a.endTime = new Date(a.endTime);
        return a;
      }))
      .then(data => setAvailabilities(data))
      .catch(console.log);
  }, [auth.user, auth.user.employee.employeeId, availabilities]); // An empty dependency array tells to run our side effect once when the component is initially loaded. 



  //add
  const handleAdd = (event) => {
    event.preventDefault();

    const form = document.getElementById('addForm');
    const formData = new FormData(form);

    const availability = {

      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      employeeId: auth.user.employee.employeeId
    }

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.user.token}`
      },
      body: JSON.stringify(availability)
    };

    fetch('http://localhost:8080/api/availabilities', init)
      .then(response => {
        if (response.status === 201 || response.status === 400) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => {
        if (data.availabilityId) {
          console.log(JSON.stringify(data));
          //TODO: display success message
          //close modal
          //TODO: RELOAD DATA ON PAGE (should automatically happen if availabilities changes)

          availabilities.push(data);

        } else {
          //unhappy path
          setErrors(data);
        }
      })
      .catch(console.log);
  };



  //Delete
  const handleDeleteAvail = (availabilityId) => {
    const availability = availabilities.find(a => a.availabilityId === availabilityId);

    if (window.confirm(`Delete availability from ${date.format(availability.startTime, 'ddd, MMM D, YYYY')} to ${date.format(availability.endTime, 'ddd, MMM D, YYYY')}?`)) {
      const init = {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.user.token}`
        },
      };

      fetch(`http://localhost:8080/api/availabilities/${availabilityId}`, init)
        .then(response => {
          if (response.status === 204) {
            const newAvailabilities = availabilities.filter(a => a.availabilityId !== availabilityId);
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
      <button data-dismiss="modal" className="btn btn-primary my-4" data-toggle="modal" data-target="#addModal">
        Add Availability
      </button>

      {errors.length > 0 &&
        <div class="alert alert-danger">
          <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
          <strong>Oh snap! We couldn't do that! </strong>{errors.map(error => (<span key={error}>
            {error}. </span>
          ))}
        </div>
      }

      <table className="table table-striped table-hover table-sm">
        <thead className="thead-dark">
          <tr>
            <th>Availability</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {availabilities.map(availability => (
            <tr key={availability.availabilityId}>
              <td className="text-center">{date.format(availability.startTime, 'ddd, MMM D, YYYY')} {date.format(availability.startTime, 'h:mm A')} - {date.format(availability.endTime, 'ddd, MMM D, YYYY')} {date.format(availability.endTime, 'h:mm A')}</td>
              <td>
                <div className="float-right mr-2">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAvail(availability.availabilityId)}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* END OF PAGE - MODALS BELOW*/}

      {/* Add Modal */}

      <div className="modal fade" id="addModal" tabIndex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">

              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h5 className="modal-title" id="addModalLabel">Add Availability</h5>
            </div>
            <div className="modal-body">
              <form id="addForm">
                <div className="row">
                  <div className="col-xs-6">
                    <label htmlFor="startTime">Start Time</label>
                    <input type="datetime-local" className="form-control inline" id="startTime" name="startTime"></input>
                  </div>

                  <div className="col-xs-6">
                    <label htmlFor="endTime">End Time</label>
                    <input type="datetime-local" className="form-control" id="endTime" name="endTime"></input>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" form="addForm" id="addModalButton" data-dismiss={errors.length !== 0 ? "" : "modal"} onClick={handleAdd}>Add</button>
              <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>


      {/* Delete Modal
      <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
        Delete Availability Model
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">

              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h5 className="modal-title" id="exampleModalLabel">Delete this availability?</h5>
            </div>
            <div className="modal-body">
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div> */}






    </>
  );
}

export default AvailabilityList;