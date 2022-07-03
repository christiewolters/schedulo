package learn.shift_scheduler.data;

import learn.shift_scheduler.domain.Result;
import learn.shift_scheduler.models.Schedule;
import learn.shift_scheduler.models.Shift;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ScheduleJdbcTemplateRepositoryTest {


    @Autowired
    private ScheduleJdbcTemplateRepository repository;

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
    void shouldFindAll() {
        List<Schedule> result = repository.findAll();
        assertNotNull(result);
        assertTrue(result.size() >= 2);
    }

    @Test
    void shouldFindById() {
        Schedule result = repository.findById(2);
        assertNotNull(result);

    }

    @Test
    void shouldCreate() {
        Schedule schedule = new Schedule();

        schedule.setScheduleId(0);
        schedule.setStartDate(LocalDate.parse("2022-06-05"));
        schedule.setEndDate(LocalDate.parse("2022-06-05"));

        Result<Schedule> result = new Result<>();
        result.setPayload(repository.create(schedule));
        assertNotNull(result.getPayload());
        assertTrue(result.isSuccess());
    }

    @Test
    void shouldUpdate() {
        Schedule schedule = repository.findById(2);
        schedule.setFinalized(true);

        assertTrue(repository.update(schedule));
    }

    @Test
    void shouldDeleteById() {
        Schedule schedule = new Schedule();

        schedule.setScheduleId(0);
        schedule.setStartDate(LocalDate.parse("2022-07-05"));
        schedule.setEndDate(LocalDate.parse("2022-07-05"));

        Result<Schedule> result = new Result<>();
        result.setPayload(repository.create(schedule));
        assertNotNull(result.getPayload());
        assertTrue(result.isSuccess());

        int toDeleteId = result.getPayload().getScheduleId();
        assertTrue(repository.deleteById(toDeleteId));
    }
}