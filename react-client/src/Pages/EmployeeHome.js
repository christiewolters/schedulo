import Navbar from "../Components/Navbar";
import EmployeeShiftList from "../Components/EmployeeShiftList";

function EmployeeHome() {
    return (
      <>
      <h3 className="text-center">Employee's Home Page</h3>
      <EmployeeShiftList />
      </>
    );
  }
  
  export default EmployeeHome;