package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.ScheduleJdbcTemplateRepository;
import learn.shift_scheduler.data.ShiftJdbcTemplateRepository;
import learn.shift_scheduler.models.Schedule;
import learn.shift_scheduler.models.Shift;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ScheduleServiceTest {

    @Autowired
    private ScheduleJdbcTemplateRepository repository;

    @Autowired
    private ScheduleService service;

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
        List<Schedule> result = service.findAll();
        assertTrue(result.size()>=2);
    }

    @Test
    void shouldFindById() {
        Schedule result = service.findById(2);
        assertNotNull(result);
    }

    @Test
    void shouldCreate() {
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-08-01"));
        schedule.setEndDate(LocalDate.parse("2022-08-07"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertTrue(result.isSuccess());

    }

    @Test
    void shouldNotCreateNullSchedule(){
        Result<Schedule> result = service.create(null);
        assertFalse(result.isSuccess());
    }



    @Test
    void shouldNotCreateWithNullStartDate(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(null);
        schedule.setEndDate(LocalDate.parse("2022-08-01"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);

    }

    // continue with nulls

    @Test
    void update() {
    }

    @Test
    void deleteById() {
    }
}