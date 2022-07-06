import Navbar from "../Components/Navbar";
import EmployeeShiftList from "../Components/ShiftsList";

function ManagerHome() {
  return (
    <>
        <div className="flex-container shifts_image width-100percent">
          <div className="flex-child-list">
          <div className="container">
      <EmployeeShiftList />
      </div>
          </div>
          <div className="">
        </div>
          </div>
    </>
  );
}

export default ManagerHome;