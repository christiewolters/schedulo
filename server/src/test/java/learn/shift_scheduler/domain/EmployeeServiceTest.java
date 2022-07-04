package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.EmployeeJdbcTemplateRepository;
import learn.shift_scheduler.models.Employee;
import learn.shift_scheduler.models.Schedule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EmployeeServiceTest {

    @Autowired
    private EmployeeJdbcTemplateRepository repository;

    @Autowired
    private EmployeeService service;

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
        List<Employee> result = service.findAll();
        assertTrue(result.size()>=4);
    }

    @Test
    void shouldFindById() {
        Employee result = service.findById(1);
        assertNotNull(result);
    }

    @Test
    void shouldNotFindNonExistingId(){
        Employee result = service.findById(99);
        assertNull(result);
    }

    @Test
    void shouldCreate() {
        Employee employee = new Employee();
        employee.setAppUserId(1);
        employee.setFirstName("Test");
        employee.setLastName("Employee");
        employee.setWage(1.0);

        Result<Employee> result = service.create(employee);
        assertTrue(result.isSuccess());
    }

    @Test
    void shouldNotCreateNullEmployee(){
        Result<Employee> result = service.create(null);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("null"));
    }

    @Test
    void shouldNotCreateWithNullFirstName(){
        Employee employee = new Employee();
        employee.setAppUserId(1);
        employee.setLastName("Employee");
        employee.setWage(1.0);

        Result<Employee> result = service.create(employee);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    void shouldNotCreateWithBlankFirstName(){
        Employee employee = new Employee();
        employee.setAppUserId(1);
        employee.setFirstName(" ");
        employee.setLastName("Employee");
        employee.setWage(1.0);

        Result<Employee> result = service.create(employee);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    void shouldNotCreateWithNullLastName(){
        Employee employee = new Employee();
        employee.setAppUserId(1);
        employee.setFirstName("Test");
        employee.setWage(1.0);

        Result<Employee> result = service.create(employee);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    void shouldNotCreateWithBlankLastName(){
        Employee employee = new Employee();
        employee.setAppUserId(1);
        employee.setFirstName("Test");
        employee.setLastName(" ");
        employee.setWage(1.0);

        Result<Employee> result = service.create(employee);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    void shouldNotCreateWithZeroWage(){
        Employee employee = new Employee();
        employee.setAppUserId(1);
        employee.setFirstName("Test");
        employee.setLastName("Employee");
        employee.setWage(0);

        Result<Employee> result = service.create(employee);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("higher"));
    }

    @Test
    void shouldNotCreateWithNegativeWage(){
        Employee employee = new Employee();
        employee.setAppUserId(1);
        employee.setFirstName("Test");
        employee.setLastName("Employee");
        employee.setWage(-1);

        Result<Employee> result = service.create(employee);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("higher"));
    }

    @Test
    void shouldNotCreateWithSetEmployeeId(){
        Employee employee = new Employee();
        employee.setEmployeeId(10);
        employee.setAppUserId(1);
        employee.setFirstName("Test");
        employee.setLastName("Employee");
        employee.setWage(1);

        Result<Employee> result = service.create(employee);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("not be set"));
    }


    @Test
    void shouldUpdate() {
        Employee employee = new Employee();
        employee.setAppUserId(1);
        employee.setFirstName("Testing");
        employee.setLastName("Employee");
        employee.setWage(1.0);

        Result<Employee> result = service.create(employee);
        assertTrue(result.isSuccess());
        employee = result.getPayload();
        employee.setWage(5.0);

        result = service.update(employee);
        assertTrue(result.isSuccess());

    }

    //since update uses the same validation as add, see add negative tests

    @Test
    void shouldDeleteById() {
        Employee employee = new Employee();
        employee.setAppUserId(1);
        employee.setFirstName("Testing");
        employee.setLastName("Delete");
        employee.setWage(1.0);

        Result<Employee> result = service.create(employee);
        assertTrue(result.isSuccess());

        result = service.deleteById(result.getPayload().getEmployeeId());
        assertTrue(result.isSuccess());
    }

    @Test
    void shouldNotDeleteNonExistingId(){
        Result<Employee> result = service.deleteById(99);
        assertFalse(result.isSuccess());
    }
}