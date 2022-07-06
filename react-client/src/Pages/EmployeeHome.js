import Navbar from "../Components/Navbar";
import EmployeeShiftList from "../Components/EmployeeShiftList";

function EmployeeHome() {
  return (
    <>
      <div className="home_image">
        <h3 className="strong text-center mb-0">Welcome to <span className="blue">Schedulo!</span></h3>
        <h6 className="lead text-center mt-0">A comfortable solution to setting your work schedule around your life.</h6>
        <div class="well width-300  align-center center centered-button">
          
        <button type="button" class="btn btn-primary btn-block little-opacity">Build Your Schedule</button>
        <button className="btn btn-link btn-block">View your Shifts.</button>
        </div>
      </div>
    </>
  );
}

export default EmployeeHome;