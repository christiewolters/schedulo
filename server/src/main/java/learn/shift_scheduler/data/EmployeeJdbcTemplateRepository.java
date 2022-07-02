package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Employee;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
//TODO: Add e.app_user_id to all the sql selects
@Repository
public class EmployeeJdbcTemplateRepository implements EmployeeRepository{
    private final JdbcTemplate jdbcTemplate;

    public EmployeeJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Employee> mapper = (resultSet, rowIndex) -> {
        Employee employee = new Employee();

        employee.setEmployeeId(resultSet.getInt("employee_id"));
        employee.setFirstName(resultSet.getString("first_name"));
        employee.setLastName(resultSet.getString("last_name"));
        employee.setAppUserId(resultSet.getInt("app_user_id"));
        employee.setWage(resultSet.getDouble("wage"));

        return employee;
    };

    @Override
    public List<Employee> findAll() throws DataAccessException{
        final String sql = "select employee_id, first_name, last_name, wage, e.app_user_id from employee e " +
                "inner join app_user au on e.app_user_id = au.app_user_id " +
                "where au.disabled = 0;";

        return jdbcTemplate.query(sql, mapper);
    }

    @Override
    public Employee findById(int id) throws DataAccessException{
        final String sql = "select employee_id, first_name, last_name, wage, e.app_user_id from employee e " +
                "inner join app_user au on e.app_user_id = au.app_user_id " +
                "where au.disabled = 0 and e.employee_id = ?;";

        return jdbcTemplate.query(sql,mapper,id).stream().findFirst().orElse(null);
    }

    @Override
    public Employee findByUsername(String username) throws DataAccessException{
        final String sql = "select employee_id, first_name, last_name, e.app_user_id, wage from employee e " +
                "inner join app_user au on e.app_user_id = au.app_user_id " +
                "where au.username = ?;";

        return jdbcTemplate.query(sql, mapper, username).stream().findFirst().orElse(null);
    }

    @Override
    public Employee create(Employee employee) throws DataAccessException{
        final String sql = "insert into employee (employee_id, first_name, last_name, app_user_id, wage) " +
                "values (?,?,?,?,?);";

        Integer maxAppUserId = jdbcTemplate.queryForObject("select max(app_user_id) from app_user;", Integer.class);
        employee.setAppUserId(maxAppUserId);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, employee.getEmployeeId());
            statement.setString(2,    employee.getFirstName());
            statement.setString(3,    employee.getLastName());
            statement.setInt(4, employee.getAppUserId());
            statement.setDouble(5, employee.getWage());
            return statement;
        }, keyHolder);
        if (rowsAffected == 0) {
            return null;
        }
        employee.setEmployeeId(keyHolder.getKey().intValue());


        return employee;
    }

    @Override
    public boolean update(Employee employee){
        final String sql = "update employee set " +
                "first_name = ?, " +
                "last_name = ?, " +
                "wage = ? " +
                "where employee_id = ?;";

        return jdbcTemplate.update(sql,
                employee.getFirstName(),
                employee.getLastName(),
                employee.getWage(),
                employee.getEmployeeId()) > 0;
    }

    @Override
    public boolean deleteById(int id){
        jdbcTemplate.update("delete from shift where employee_id = ?;", id);
        jdbcTemplate.update("delete from availability where employee_id = ?;", id);
        return jdbcTemplate.update("delete from employee where employee_id = ?;", id) > 0;
    }











}
