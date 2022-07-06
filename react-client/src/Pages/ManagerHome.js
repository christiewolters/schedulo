import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";

function ManagerHome() {
  return (
    <>
          <div className="home_image">
        <h3 className="strong text-center mb-0">Welcome to <span className="blue">Schedulo!</span></h3>
        <h6 className="lead text-center mt-0">Making scheduling easier by giving employees the freedom to set their availability from home.</h6>
        <div className="well width-300  align-center center centered-button">
          
        <Link className="btn btn-primary btn-block little-opacity" to="/employee/availability">Build Your Schedule</Link>
        <Link className="btn btn-link btn-block" to="/shifts">View your Shifts.</Link>
        </div>
      </div>
    </>
  );
}

export default ManagerHome;