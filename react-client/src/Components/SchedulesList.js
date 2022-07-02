import date from 'date-and-time'; import { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from '../AuthContext';

function SchedulesList() {

    const [schedules, setSchedules] = useState([]);

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
    }, [auth.user.token]); // An empty dependency array tells to run our side effect once when the component is initially loaded.    

    //delete
    const handleDeleteSchedule = (scheduleId) => {
        const schedule = schedules.find(schedule => schedule.id === scheduleId);

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
            <section className="panel panel-default">
                <div className="panel-heading parent">
                    <h4 className="m-0 p-0 inline">My Schedules</h4>
                    <span><i className="glyphicon glyphicon-plus pr-4"></i></span>
                </div>


                <div className="parent title-spacing center">
                    <div className="child">
                        <button className="btn btn-primary my-4 mr-4" onClick={() => history.push('/schedules/add')}>
                            <i className="bi bi-plus-circle"></i> Add Schedule
                        </button>
                    </div>
                    <h5 className="mt-4 pt-3 inline">Upcoming Schedules</h5>
                </div>

                <div className="list-group">
                    <div className="list-subheader">Current Schedules</div>
                    {schedules.filter(s => s.endDate - new Date() >= 0).map(schedule => (
                        <Link to={`/schedules/edit/${schedule.id}`} key={schedule.scheduleId}
                            className={schedule.finalized ? "list-group-item text-center disabled" : "list-group-item text-center"} >
                            {date.format(schedule.startDate, 'MM/DD/YYYY')} - {date.format(schedule.endDate, 'MM/DD/YYYY')}

                            <span className="float-right">
                                {schedule.finalized && (
                                    <span>locked</span>
                                )}
                                <button type="button" className="remove-btn-icon" onClick={() => handleDeleteSchedule(schedule.id)}>
                                    <i className="glyphicon glyphicon-trash"></i>
                                </button>
                            </span>
                        </Link>
                    ))}

                    <div className="list-subheader">Past Schedules</div>
                    {schedules.filter(s => (s.endDate - new Date()) < 0).map(schedule => (
                        <div className="parent">
                            <Link to={`/schedules/edit/${schedule.id}`} key={schedule.scheduleId} className="list-group-item text-center disabled">
                                {date.format(schedule.startDate, 'MM/DD/YYYY')} - {date.format(schedule.endDate, 'MM/DD/YYYY')}

                                <span className="child vertical-center">
                                    {schedule.finalized && (
                                        <i className="	glyphicon glyphicon-lock pr-4"></i>
                                    )}
                                    <button type="button" className="remove-btn-icon pr-4" onClick={() => handleDeleteSchedule(schedule.id)}>
                                        <i className="glyphicon glyphicon-trash"></i>
                                    </button>
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>

            </section>
        </>
    );
}

export default SchedulesList;