package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.EmployeeRepository;
import learn.shift_scheduler.models.Employee;
import learn.shift_scheduler.models.Shift;
import org.springframework.dao.DataAccessException;

import java.util.List;

public class EmployeeService {

    private final EmployeeRepository repository;


    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public List<Employee> findAll() throws DataAccessException{
        return repository.findAll();
    }

    public Employee findById(int id) throws DataAccessException{
        return repository.findById(id);
    }

    public Employee findByUsername(String username) throws DataAccessException{
        return repository.findByUsername(username);
    }

    public Result<Employee> create(Employee employee) throws DataAccessException{
        Result<Employee> result = validate(employee);
        if (employee != null && employee.getEmployeeId() > 0){
            result.addMessage("Employee id should not be set.", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            employee = repository.create(employee);
            result.setPayload(employee);
        }

        return result;
    }

    public Result<Employee> update(Employee employee) throws DataAccessException{
        Result<Employee> result = validate(employee);

        if (employee.getEmployeeId() <= 0){
            result.addMessage("Employee Id is required", ResultType.INVALID);
        }

        if (result.isSuccess()){
            if (repository.update(employee)){
                result.setPayload(employee);
            }
            else {
                result.addMessage(String.format("Employee id with id %s not found", employee.getEmployeeId()), ResultType.NOT_FOUND);
            }
        }

        return result;
    }

    public Result<Employee> deleteById(int id) throws DataAccessException{
        Result<Employee> result = new Result<>();
        if (!repository.deleteById(id)){
            result.addMessage(String.format("Employee id with id %s not found", id), ResultType.NOT_FOUND);
        }
        return result;
    }

    private Result<Employee> validate(Employee employee) throws DataAccessException{
        Result<Employee> result = new Result<>();

        if (employee == null){
            result.addMessage("Employee cannot be null", ResultType.INVALID);
            return result;
        }

        if (employee.getFirstName() == null || employee.getFirstName().isBlank()){
            result.addMessage("Employee First Name is required", ResultType.INVALID);
        }

        if (employee.getLastName() == null || employee.getLastName().isBlank()){
            result.addMessage("Employee Last Name is required", ResultType.INVALID);
        }

        if (employee.getWage() <= 0){
            result.addMessage("Wage must be higher than 0", ResultType.INVALID);
        }

        return result;
    }

}
