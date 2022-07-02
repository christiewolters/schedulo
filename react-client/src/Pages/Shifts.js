import Navbar from "../Components/Navbar";
import EmployeeShiftList from "../Components/EmployeeShiftList";

function ManagerHome() {
  return (
    <>
      <h3 className="text-center">My Shifts</h3>
      <EmployeeShiftList />
    </>
  );
}

export default ManagerHome;