import Navbar from "../Components/Navbar";
import EmployeeShiftList from "../Components/EmployeeShiftList";

function About() {
  return (
    <>
        <div className="home_image">
          <h3 className="strong text-center mb-0">Welcome to <span className="blue">Schedulo!</span></h3>
          <h6 className="lead text-center mt-0">A comfortable solution to setting your work schedule around your life.</h6>
           <p className="width-50percent">
            This app makes scheduling easier by letting you share your availability with your managers from home,
            so you are only scheduled when you want to be scheduled!
            Start by setting up your availability so your employer can begin scheduling you! When next week's schedule is
            finalized, you'll see your shifts on the My Shifts page.
            </p> 
          </div>

          <h3 className="text-center">Manager Home Page</h3>
      <h6 className="text-center pl-5 pr-5">Welcome to your company's convenient home shift scheduler!
        <br />
        <br />
        This app makes scheduling easier by giving your employees the freedom to set their availability from home.
        We have a handy scheduling tool to make building timesheets a snap!
        <br />
        <br />
        Check out the schedules tab and start building your next weekly schedule!
      </h6>
    </>
  );
}

export default About;