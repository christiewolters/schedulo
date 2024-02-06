package learn.shift_scheduler.data;

import learn.shift_scheduler.domain.Result;
import learn.shift_scheduler.models.Employee;
import learn.shift_scheduler.models.Schedule;
import learn.shift_scheduler.models.Shift;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.EmptySqlParameterSource;

import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EmployeeJdbcTemplateRepositoryTest {


    @Autowired
    private EmployeeJdbcTemplateRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    static boolean hasSetup = false;

    @BeforeEach
    void setup() {
        if (!hasSetup) {
            hasSetup = true;
            jdbcTemplate.update("call set_known_good_state();");
        }
    }
    @Test
    void shouldFindAll() {
        List<Employee> result = repository.findAll();
        assertNotNull(result);
        assertTrue(result.size() >= 4);
    }

    @Test
    void findById() {
        Employee result = repository.findById(2);
        assertNotNull(result);
    }


    @Test
    void create() {
        Employee employee = new Employee();

        employee.setEmployeeId(0);
        employee.setFirstName("test");
        employee.setLastName("dummy");
        employee.setAppUserId(1);
        employee.setWage(10.0);

        Result<Employee> result = new Result<>();
        result.setPayload(repository.create(employee));
        assertNotNull(result.getPayload());
        assertTrue(result.isSuccess());
    }

    @Test
    void update() {
        Employee employee = repository.findById(2);
        employee.setWage(15.0);

        assertTrue(repository.update(employee));
    }

    @Test
    void deleteById() {
        Employee employee = new Employee();

        employee.setEmployeeId(0);
        employee.setFirstName("otherTest");
        employee.setLastName("dummy");
        employee.setAppUserId(2);
        employee.setWage(10.0);

        Result<Employee> result = new Result<>();
        result.setPayload(repository.create(employee));
        assertNotNull(result.getPayload());
        assertTrue(result.isSuccess());


        int toDeleteId = result.getPayload().getEmployeeId();
        assertTrue(repository.deleteById(toDeleteId));
    }
}