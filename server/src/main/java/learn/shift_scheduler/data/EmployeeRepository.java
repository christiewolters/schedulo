package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Employee;
import org.springframework.dao.DataAccessException;

import java.util.List;

public interface EmployeeRepository {
    List<Employee> findAll() throws DataAccessException;

    Employee findById(int id) throws DataAccessException;

    Employee findByUsername(String username) throws DataAccessException;

    Employee create(Employee employee) throws DataAccessException;

    boolean update(Employee employee);

    boolean deleteById(int id);
}
