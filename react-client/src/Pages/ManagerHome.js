import Navbar from "../Components/Navbar";
import EmployeeShiftList from "../Components/EmployeeShiftList";

function ManagerHome() {
  return (
    <>
      <Navbar />
      <h1 className="text-center">Manager's Home Page</h1>
      <EmployeeShiftList />
      <h2>This is h2</h2>
      <h3>This is h3</h3>
      <h4>This is h4</h4>
      <h5>This is h5</h5>
      <h6>This is h6</h6>
      <p>This is paragraph text.</p>
    </>
  );
}

export default ManagerHome;