package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.ScheduleJdbcTemplateRepository;
import learn.shift_scheduler.models.Schedule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.LocalDate;
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
        assertTrue(result.getMessages().get(0).contains("null"));
    }



    @Test
    void shouldNotCreateWithNullStartDate(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(null);
        schedule.setEndDate(LocalDate.parse("2022-08-01"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    void shouldNotCreateWithNullEndDate(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-08-01"));
        schedule.setEndDate(null);
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    void shouldNotCreateWithEndDateBeforeStartDate(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-08-01"));
        schedule.setEndDate(LocalDate.parse("2022-07-01"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("after"));
    }

    @Test
    void shouldNotCreateWithStartDateInThePast(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-01-01"));
        schedule.setEndDate(LocalDate.parse("2022-07-01"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("past"));
    }

    @Test
    void shouldNotCreateScheduleShorterThanSevenDays(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-08-01"));
        schedule.setEndDate(LocalDate.parse("2022-08-02"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("7"));
    }

    @Test
    void shouldNotCreateScheduleLongerThanSevenDays(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-08-01"));
        schedule.setEndDate(LocalDate.parse("2022-09-02"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("7"));
    }

    @Test
    void shouldNotCreateScheduleOverlappingAtStart(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-07-27"));
        schedule.setEndDate(LocalDate.parse("2022-08-02"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("overlap"));
    }

    @Test
    void shouldNotCreateScheduleOverlappingAtEnd(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-08-06"));
        schedule.setEndDate(LocalDate.parse("2022-08-12"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("overlap"));
    }

    @Test
    void shouldNotCreateDuplicateSchedule(){
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-08-01"));
        schedule.setEndDate(LocalDate.parse("2022-08-07"));
        schedule.setFinalized(false);

        Result<Schedule> result = service.create(schedule);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("overlap"));
    }

    @Test
    void shouldUpdate() {
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-08-21"));
        schedule.setEndDate(LocalDate.parse("2022-08-27"));
        schedule.setFinalized(false);

        Result<Schedule> first = service.create(schedule);
        assertTrue(first.isSuccess());

        schedule.setFinalized(true);
        Result<Schedule> result = service.update(schedule);
        assertTrue(result.isSuccess());
    }

    @Test
    void shouldNotUpdateNonexistingSchedule(){
        Schedule schedule = new Schedule();
        schedule.setScheduleId(99);
        schedule.setStartDate(LocalDate.parse("2022-09-21"));
        schedule.setEndDate(LocalDate.parse("2022-09-27"));
        schedule.setFinalized(false);
        Result<Schedule> result = service.update(schedule);

        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("not found"));

    }

    //Since update and add use the same validation, see above negative add tests

    @Test
    void shouldDeleteById() {
        Schedule schedule = new Schedule();
        schedule.setStartDate(LocalDate.parse("2022-08-13"));
        schedule.setEndDate(LocalDate.parse("2022-08-19"));
        schedule.setFinalized(false);
        Result<Schedule> result = service.create(schedule);
        assertTrue(result.isSuccess());

        result = service.deleteById(result.getPayload().getScheduleId());
        assertTrue(result.isSuccess());
    }
}