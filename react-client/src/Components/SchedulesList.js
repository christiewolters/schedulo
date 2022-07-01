import { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from '../AuthContext';

function SchedulesList() {

    const dummySchedules =
        [
            {
                "scheduleId": 1,
                "startDate": "2022-06-05T08:00:00",
                "endDate": "2022-06-05T12:00:00",
                "finalized": 1
            },
            {
                "scheduleId": 2,
                "startDate": "2022-06-06T09:00:00",
                "endDate": "2022-06-06T12:00:00",
                "finalized": 1
            },
            {
                "scheduleId": 3,
                "startDate": "2022-06-07T10:00:00",
                "endDate": "2022-06-07T12:30:00",
                "finalized": 1
            },
            {
                "scheduleId": 4,
                "startDate": "2022-06-06T09:00:00",
                "endDate": "2022-06-06T12:00:00",
                "finalized": 0
            },
            {
                "scheduleId": 5,
                "startDate": "2022-06-06T09:00:00",
                "endDate": "2022-06-06T12:00:00",
                "finalized": 0
            },
        ];

    //TEMPORTY FILLER CODE FOR DUMMY DATA
    // const dummySchedules = [
    //     { scheduleId: 1, startDate: '2022-07-03 00:00:00', endDate: '2022-07-09 23:59:00', finalized: false },
    //     { scheduleId: 2, startDate: '2022-06-12 00:00:00', endDate: '2022-06-18 23:59:00', finalized: true },
    //     { scheduleId: 3, startDate: '2022-06-05 00:00:00', endDate: '2022-06-11 23:59:00', finalized: true }
    // ];

    const [schedules, setSchedules] = useState(dummySchedules);



    // const [schedules, setSchedules] = useState([]);

    const auth = useContext(AuthContext);

    const history = useHistory();

    // useEffect(() => {
    //     fetch('http://localhost:8080/api/schedules')
    //         .then(response => {
    //             if (response.status === 200) {
    //                 return response.json();
    //             } else {
    //                 return Promise.reject(`Unexpected status code: ${response.status}`);
    //             }
    //         })
    //         .then(data => setSchedules(data))
    //         .catch(console.log);
    // }, []); // An empty dependency array tells to run our side effect once when the component is initially loaded.    


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
    <section className="panel panel-default">
      <div className="panel-heading">
        <h4 className="m-0 p-0">My Schedules</h4>
      </div>


            <div className="parent">
                <div className="child">
                    <button className="btn btn-primary my-4 mr-4" onClick={() => history.push('/schedules/add')}>
                        <i className="bi bi-plus-circle"></i> Add Schedule
                    </button>
                </div>
                    <h5 className="mt-4 pt-3 inline">Upcoming Schedules</h5>
            </div>

                <div className="list-group">
                <div className="list-subheader">Current Schedules</div>
                    {schedules.filter(s => s.finalized === 1).map(schedule => (
                        <Link to={`/schedules/edit/${schedule.id}`} key={schedule.scheduleId} className="list-group-item text-center">
                            {schedule.startDate} - {schedule.endDate}

                            <span className="float-right">
                                <button type="button" className="remove-btn-icon" onClick={() => handleDeleteSchedule(schedule.id)}>
                                    <i className="glyphicon glyphicon-trash"></i>
                                </button>
                            </span>
                        </Link>
                    ))}

                    <div className="list-subheader">Past Schedules</div>
                    {schedules.filter(s => s.finalized === 0).map(schedule => (
                        <Link to={`/schedules/edit/${schedule.id}`} key={schedule.scheduleId} className="list-group-item text-center disabled">
                            {schedule.startDate} - {schedule.endDate}

                            <span className="float-right">
                                <button type="button" className="remove-btn-icon" onClick={() => handleDeleteSchedule(schedule.id)}>
                                    <i className="glyphicon glyphicon-trash"></i>
                                </button>
                            </span>
                        </Link>
                    ))}
                </div>

            </section>
        </>
    );
}

export default SchedulesList;