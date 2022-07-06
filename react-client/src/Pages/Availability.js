import Navbar from "../Components/Navbar";
import AvailabilityList from "../Components/AvailabilityList";

function Availability() {

  return (
    <>
      <div className="availability_image">
        <div className="row">
          <div className="col-md-6">
          </div>
          <div className="col-md-6">
            <h3 className="text-center">Availability</h3>
            <h5 className="text-center">Tell your boss when you are available to work.</h5>
            <h6 className="text-center">You won't be scheduled if you don't!</h6>
            <AvailabilityList />
          </div>
        </div>
      </div>
    </>
  );
}

export default Availability;