import '../Css/boot-spacing.css';

function BuildAvailability() {
  return (
    <>
      <div className="panel panel-primary">
        <div className="panel-heading">
          Schedule June 4 - 10
        </div>
        <table className="table">
          <thead>
          </thead>
          <tbody>
            <tr>
              <td>Sun</td>
              <td>Mark</td>
              <td className="width-50"><button type="button" className="remove-btn-icon"><i className="glyphicon glyphicon-trash"></i></button></td>
              <td className="width-50"><button type="button" className="plus-btn-icon"><i class="glyphicon glyphicon-plus"></i></button></td>
            </tr>
            <tr>
              <td>Mon</td>
              <td>Jacob</td>
              <td className="width-50"><button type="button" className="remove-btn-icon"><i className="glyphicon glyphicon-trash"></i></button></td>
              <td></td>
            </tr>
            <tr>
              <td>Tues</td>
              <td>Larry</td>
              <td className="width-50"><button type="button" className="remove-btn-icon"><i className="glyphicon glyphicon-trash"></i></button></td>
              <td></td>
            </tr>
            <tr>
              <td>Wed</td>
              <td>Mark</td>
              <td className="width-50"><button type="button" className="remove-btn-icon"><i className="glyphicon glyphicon-trash"></i></button></td>
              <td></td>
            </tr>
            <tr>
              <td>Thurs</td>
              <td>Jacob</td>
              <td className="width-50"><button type="button" className="remove-btn-icon"><i className="glyphicon glyphicon-trash"></i></button></td>
              <td></td>
            </tr>
            <tr>
              <td>Fri</td>
              <td>Larry</td>
              <td className="width-50"><button type="button" className="remove-btn-icon"><i className="glyphicon glyphicon-trash"></i></button></td>
              <td></td>
            </tr>
            <tr>
              <td>Sat</td>
              <td>Larry</td>
              <td className="width-50"><button type="button" className="remove-btn-icon"><i className="glyphicon glyphicon-trash"></i></button></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="availability-panel-bottom">
        <button type="submit" className="btn btn-normal">Save</button>
      </div>

    </>

  );
}

export default BuildAvailability;