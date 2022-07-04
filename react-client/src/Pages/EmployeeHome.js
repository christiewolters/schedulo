import Navbar from "../Components/Navbar";
import EmployeeShiftList from "../Components/EmployeeShiftList";

function EmployeeHome() {
    return (
      <>
      <h3 className="text-center">Employee Home Page</h3>
      <h6 className="text-center pl-5 pr-5">Welcome to your company's convenient home shift scheduler!
        <br />
        <br />
        This app makes scheduling easier by letting you share your availability with your managers from home, 
        so you are only scheduled when you want to be scheduled!
        <br />
        <br />
        Start by setting up your availability so your employer can begin scheduling you! When next week's schedule is
        finalized, you'll see your shifts on the My Shifts page.
      </h6>
      </>
    );
  }
  
  export default EmployeeHome;