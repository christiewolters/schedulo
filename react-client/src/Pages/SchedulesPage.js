import Navbar from "../Components/Navbar";
import SchedulesList from "../Components/SchedulesList";

function ViewSchedules() {
    return (
        <>
            <div className="flex-container">
                <div className="schedule_image">
                </div>
                <div className="flex-child-list special">
                        <h3 className="mb-0 mt-0 pb-0 mb-0 blue">Schedules</h3>
                        <SchedulesList />
                </div>
            </div>
        </>
    );
}

export default ViewSchedules;