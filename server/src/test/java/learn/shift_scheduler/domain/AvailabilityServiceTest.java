package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.AvailabilityJdbcTemplateRepository;
import learn.shift_scheduler.models.Availability;
import learn.shift_scheduler.models.Employee;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AvailabilityServiceTest {

    @Autowired
    private AvailabilityJdbcTemplateRepository repository;

    @Autowired
    private AvailabilityService service;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    static boolean hasSetup = false;

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @BeforeEach
    void setup() {
        if (!hasSetup) {
            hasSetup = true;
            jdbcTemplate.update("call set_known_good_state();");
        }
    }


    @Test
    void shouldFindAll() {
        List<Availability> result = service.findAll();
        assertTrue(result.size()>=5);
    }

    @Test
    void shouldFindByAvailabilityId() {
        Availability result = service.findByAvailabilityId(1);
        assertNotNull(result);
    }

    @Test
    void shouldFindByEmployeeId() {
        List<Availability> result = service.findByEmployeeId(2);
        assertTrue(result.size()>=3);
    }

    @Test
    void shouldCreate() {
        Availability availability = new Availability();
        availability.setStartTime(LocalDateTime.parse("2022-08-01 00:00:00", formatter));
        availability.setEndTime(LocalDateTime.parse("2022-08-07 23:59:00", formatter));
        availability.setEmployeeId(1);

        Result<Availability> result = service.create(availability);
        assertTrue(result.isSuccess());
    }

    @Test
    void shouldNotCreateNullAvailability() {
        Result<Availability> result = service.create(null);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("null"));
    }

    @Test
    void shouldNotCreateWithNullStartTime(){
        Availability availability = new Availability();
        availability.setEndTime(LocalDateTime.parse("2022-08-07 23:59:00", formatter));
        availability.setEmployeeId(1);

        Result<Availability> result = service.create(availability);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    void shouldNotCreateWithNullEndTime(){
        Availability availability = new Availability();
        availability.setStartTime(LocalDateTime.parse("2022-08-01 00:00:00", formatter));
        availability.setEmployeeId(1);

        Result<Availability> result = service.create(availability);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    void ShouldNotCreateWithEndTimeBeforeStartTime(){
        Availability availability = new Availability();
        availability.setStartTime(LocalDateTime.parse("2022-08-07 00:00:00", formatter));
        availability.setEndTime(LocalDateTime.parse("2022-08-01 23:59:00", formatter));
        availability.setEmployeeId(1);

        Result<Availability> result = service.create(availability);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("after"));
    }

    @Test
    void ShouldNotCreateWithStartTimeInThePast(){
        Availability availability = new Availability();
        availability.setStartTime(LocalDateTime.parse("2022-01-01 00:00:00", formatter));
        availability.setEndTime(LocalDateTime.parse("2022-08-01 23:59:00", formatter));
        availability.setEmployeeId(1);

        Result<Availability> result = service.create(availability);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("past"));
    }

    @Test
    void ShouldNotCreateDuplicateAvailability(){
        Availability availability = new Availability();
        availability.setStartTime(LocalDateTime.parse("2022-08-01 00:00:00", formatter));
        availability.setEndTime(LocalDateTime.parse("2022-08-07 23:59:00", formatter));
        availability.setEmployeeId(1);


        Result<Availability> result = service.create(availability);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("duplicate"));
    }

    @Test
    void shouldUpdate() {
        Availability availability = new Availability();
        availability.setStartTime(LocalDateTime.parse("2022-09-01 00:00:00", formatter));
        availability.setEndTime(LocalDateTime.parse("2022-09-07 23:59:00", formatter));
        availability.setEmployeeId(1);

        Result<Availability> result = service.create(availability);
        availability=result.getPayload();
        availability.setEndTime(LocalDateTime.parse("2022-09-08 23:59:00", formatter));
        result=service.update(availability);
        assertTrue(result.isSuccess());
    }

    //Since update uses the same validation as add, see add negative tests

    @Test
    void shouldDeleteById() {
        Availability availability = new Availability();
        availability.setStartTime(LocalDateTime.parse("2022-09-01 00:00:00", formatter));
        availability.setEndTime(LocalDateTime.parse("2022-09-07 23:59:00", formatter));
        availability.setEmployeeId(2);

        Result<Availability> result = service.create(availability);
        result=service.deleteById(result.getPayload().getAvailabilityId());
        assertTrue(result.isSuccess());
    }

    @Test
    void shouldNotDeleteNonExistingId(){
        Result<Availability> result = service.deleteById(99);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("not found"));
    }
}