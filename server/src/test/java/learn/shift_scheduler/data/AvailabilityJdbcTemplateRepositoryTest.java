package learn.shift_scheduler.data;

import learn.shift_scheduler.domain.Result;
import learn.shift_scheduler.models.Availability;
import learn.shift_scheduler.models.Schedule;
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
class AvailabilityJdbcTemplateRepositoryTest {

    @Autowired
    private AvailabilityJdbcTemplateRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    static boolean hasSetup = false;

    @BeforeEach
    void setup() {
        if (!hasSetup) {
            hasSetup = true;
            jdbcTemplate.update("call set_known_good_state();");
        }
    }

    @Test
    void findAll() {
        List<Availability> result = repository.findAll();
        assertNotNull(result);
        assertTrue(result.size() >= 5);
    }

    @Test
    void findByAvailabilityId() {
        Availability result = repository.findByAvailabilityId(2);
        assertNotNull(result);
    }

    @Test
    void findByEmployeeId() {
        List<Availability> result = repository.findByEmployeeId(2);
        assertTrue(result.size() >= 3);
    }

    @Test
    void create() {
        Availability availability = new Availability();
        availability.setAvailabilityId(0);
        availability.setStartTime(LocalDateTime.parse("2022-07-05 00:00:00", formatter));
        availability.setEndTime(LocalDateTime.parse("2022-07-05 04:00:00", formatter));
        availability.setEmployeeId(2);

        Result<Availability> result = new Result<>();
        result.setPayload(repository.create(availability));
        assertNotNull(result.getPayload());
        assertTrue(result.isSuccess());
    }

    @Test
    void update() {
        Availability availability = repository.findByAvailabilityId(6);
        availability.setEmployeeId(3);
        assertTrue(repository.update(availability));
    }

    @Test
    void deleteById() {
        Availability availability = new Availability();
        availability.setAvailabilityId(0);
        availability.setStartTime(LocalDateTime.parse("2022-08-05 00:00:00", formatter));
        availability.setEndTime(LocalDateTime.parse("2022-08-05 04:00:00", formatter));
        availability.setEmployeeId(2);

        Result<Availability> result = new Result<>();
        result.setPayload(repository.create(availability));
        assertNotNull(result.getPayload());
        assertTrue(result.isSuccess());

        int toDeleteId = result.getPayload().getAvailabilityId();
        assertTrue(repository.deleteById(toDeleteId));
    }
}