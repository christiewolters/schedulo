import date from 'date-and-time'; import { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from '../AuthContext';

function SchedulesList() {

    const [schedules, setSchedules] = useState([]);
    const [errors, setErrors] = useState([]);

    const auth = useContext(AuthContext);

    const history = useHistory();

    //findAll
    useEffect(() => {
        const init = {
            headers: {
                'Authorization': `Bearer ${auth.user.token}`
            },
        };
        fetch('http://localhost:8080/api/schedules', init)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected status code: ${response.status}`);
                }
            })
            .then(data => data.map(schedule => {
                schedule.startDate = new Date(schedule.startDate);
                schedule.endDate = new Date(schedule.endDate);
                return schedule;
            }))
            .then(data => setSchedules(data))
            .catch(console.log);
    }, [auth.user.token, schedules]); // An empty dependency array tells to run our side effect once when the component is initially loaded.    





    //add
  const handleAdd = (event) => {
    event.preventDefault();

    const form = document.getElementById('addForm');
    const formData = new FormData(form);

    const schedule = {
    scheduleId : 0,
      startDate : formData.get('startDate'),
      endDate : formData.get('endDate'),
      finalized : false
    }

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.user.token}`
      },
      body: JSON.stringify(schedule)
    };

    fetch('http://localhost:8080/api/schedules', init)
      .then(response => {
        if (response.status === 201 || response.status === 400) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected status code: ${response.status}`);
        }
      })
      .then(data => {
        if (data.scheduleId) {
          console.log(JSON.stringify(data));
          //TODO: display success message
          schedules.push(data);

        } else {
          //unhappy path
          setErrors(data);
        }
      })
      .catch(console.log);
  };






    //delete
    const handleDeleteSchedule = (scheduleId) => {
        const schedule = schedules.find(schedule => schedule.scheduleId === scheduleId);

        if (window.confirm(`Delete schedule ${date.format(schedule.startDate, 'MM/DD/YYYY')}-${date.format(schedule.endDate, 'MM/DD/YYYY')}?`)) {
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
                        const newSchedules = schedules.filter(schedule => schedule.scheduleId !== scheduleId);

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

            {errors.length > 0 &&
                <div className="alert alert-danger">
                    <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <strong>Oh snap! We couldn't do that! </strong>{errors.map(error => (<span key={error}>
                        {error}. </span>
                    ))}
                </div>
            }

            <section className="panel panel-default">
                <div className="panel-heading parent">
                    <h4 className="m-0 p-0 inline">My Schedules</h4>
                    <div className="child">
                        <button data-dismiss="modal" data-toggle="modal" data-target="#addModal" className="btn btn-success mt-2 mr-2"><i className="glyphicon glyphicon-plus"></i></button>
                    </div>
                </div>


                {/* <div className="parent title-spacing center">
                    <div className="child">
                        <button className="btn btn-primary my-4 mr-4" onClick={() => history.push('/schedules/add')}>
                            <i className="bi bi-plus-circle"></i> Add Schedule
                        </button>
                    </div>
                    <h5 className="mt-4 pt-3 inline">Upcoming Schedules</h5>
                </div> */}

                <div className="list-group">
                    <div className="list-subheader">Current Schedules</div>
                    {schedules.filter(s => s.endDate - new Date() >= 0).map(schedule => (
                        <div className="parent" key={schedule.scheduleId}>
                        <Link to={`/schedules/edit/${schedule.scheduleId}`} 
                            className={schedule.finalized ? "list-group-item text-center disabled" : "list-group-item text-center"} >
                            {date.format(schedule.startDate, 'MM/DD/YYYY')} - {date.format(schedule.endDate, 'MM/DD/YYYY')}
                            </Link>
                            <span className="child vertical-center">
                                {schedule.finalized && (
                                    <span>locked</span>
                                )}
                                <button type="button" className="remove-btn-icon pr-4" onClick={() => handleDeleteSchedule(schedule.scheduleId)}>
                                    <i className="glyphicon glyphicon-trash"></i>
                                </button>
                            </span>
                        
                        </div>
                    ))}

                    <div className="list-subheader">Past Schedules</div>
                    {schedules.filter(s => (s.endDate - new Date()) < 0).map(schedule => (
                        <div className="parent" key={schedule.scheduleId}>
                            <Link to={`/schedules/edit/${schedule.scheduleId}`} className="list-group-item text-center disabled">
                                {date.format(schedule.startDate, 'MM/DD/YYYY')} - {date.format(schedule.endDate, 'MM/DD/YYYY')}
                                </Link>
                                <span className="child vertical-center">
                                    {schedule.finalized && (
                                        <i className="	glyphicon glyphicon-lock pr-4"></i>
                                    )}
                                    <button type="button" className="remove-btn-icon pr-4" onClick={() => handleDeleteSchedule(schedule.scheduleId)}>
                                        <i className="glyphicon glyphicon-trash"></i>
                                    </button>
                                </span>
                            
                        </div>
                    ))}
                </div>

            </section>


            {/* Add Modal */}

            <div className="modal fade" id="addModal" tabIndex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">

                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h5 className="modal-title" id="addModalLabel">Add Schedule</h5>
                        </div>
                        <div className="modal-body">
                            <form id="addForm">
                                <div className="row">
                                    <div className="col-xs-6">
                                        <label htmlFor="startDate">Start Date</label>
                                        <input type="date" className="form-control inline" id="startDate" name="startDate" required="required"></input>
                                    </div>

                                    <div className="col-xs-6">
                                        <label htmlFor="endDate">End Date</label>
                                        <input type="date" className="form-control" id="endDate" name="endDate" required="required"></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" form="addForm" id="addModalButton" data-dismiss="modal" onClick={handleAdd}>Add</button>
                            <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>



        </>
    );
}

export default SchedulesList;