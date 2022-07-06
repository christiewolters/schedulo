import Navbar from "../Components/Navbar";
import AvailabilityList from "../Components/AvailabilityList";

function Availability() {

  return (
    <>
    <div className="flex-container">
      <div className="availability_image">
        </div>
          <div className="flex-child-list">
          <div className="container">
          <h3 className="mb-0 blue">Availability</h3>
            <h5 className="lead mt-0">Set hours you are available to work each week. You boss may schedule you within these time slots.</h5>
          
            <AvailabilityList />
            </div>
          </div>
          </div>
    </>
  );
}

export default Availability;