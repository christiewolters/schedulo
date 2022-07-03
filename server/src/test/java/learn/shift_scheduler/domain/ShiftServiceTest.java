package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.ShiftJdbcTemplateRepository;
import learn.shift_scheduler.data.ShiftRepository;
import learn.shift_scheduler.models.Shift;
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
class ShiftServiceTest {

    @Autowired
    private ShiftJdbcTemplateRepository repository;

    @Autowired
    private ShiftService service;

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
        List<Shift> result = service.findAll();
        assertTrue(result.size()>=5);
    }

    @Test
    void shouldFindById() {
        Shift result = service.findById(2);
        assertNotNull(result);
    }

    @Test
    void shouldNotFindById(){
        Shift result = service.findById(99);
        assertNull(result);
    }

    @Test
    void shouldFindByEmployeeId() {
        List<Shift> result = service.findByEmployeeId(1);
        System.out.println(result.size());
        assertTrue(result.size()>= 2);
    }

    @Test
    void shouldNotFindByEmployeeId(){
        List<Shift> result = service.findByEmployeeId(99);
        assertEquals(0, result.size());
    }

    @Test
    void shouldFindByScheduleId() {
        List<Shift> result = service.findByScheduleId(1);
        assertTrue(result.size()>= 3);
    }

    @Test
    void shouldNotFindByScheduleId(){
        List<Shift> result = service.findByScheduleId(99);
        assertEquals(0, result.size());
    }

    @Test
    void shouldCreate() {
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(2);
        shift.setStartTime(LocalDateTime.parse("2022-08-05 20:00:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-08-05 23:59:00", formatter));
        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertTrue(result.isSuccess());
    }

    @Test
    void shouldNotCreateNullSchedule(){
        Result<Shift> result = service.create(null);
        assertFalse(result.isSuccess());
    }

    @Test
    void shouldNotCreateWithSetShiftId(){
        Shift shift = new Shift();
        shift.setShiftId(2);
        shift.setScheduleId(2);
        shift.setEmployeeId(2);
        shift.setStartTime(LocalDateTime.parse("2022-08-05 20:00:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-08-05 23:59:00", formatter));
        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().get(0).contains("Shift `id`"));
    }

    @Test
    void shouldNotCreateWithoutSetScheduleId(){
        Shift shift = new Shift();
        shift.setShiftId(0);

        shift.setEmployeeId(2);
        shift.setStartTime(LocalDateTime.parse("2022-08-05 20:00:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-08-05 23:59:00", formatter));
        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("schedule"));
    }

    @Test
    void shouldNotCreateWithNullStartTime(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(2);

        shift.setEndTime(LocalDateTime.parse("2022-08-05 23:59:00", formatter));
        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("Start"));
    }

    @Test
    void shouldNotCreateWithNullEndTime(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(2);
        shift.setStartTime(LocalDateTime.parse("2022-08-05 23:59:00", formatter));

        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("End"));
    }

    @Test
    void shouldNotCreateWithEndTimeBeforeStartTime(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(2);
        shift.setStartTime(LocalDateTime.parse("2022-08-06 23:59:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-08-05 23:59:00", formatter));

        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("end time must be after start time"));
    }

    @Test
    void shouldNotCreateWithNullEarned(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(2);
        shift.setStartTime(LocalDateTime.parse("2022-08-04 23:59:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-08-05 23:59:00", formatter));

        shift.setEarned(null);
        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("Earned"));
    }

    @Test
    void shouldNotCreateWithBlankEarned(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(2);
        shift.setStartTime(LocalDateTime.parse("2022-08-04 23:59:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-08-05 23:59:00", formatter));

        shift.setEarned("");
        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("Earned"));

    }

    @Test
    void shouldNotCreateEncapsulatedOverlappingShift(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(1);
        shift.setStartTime(LocalDateTime.parse("2022-06-05 09:59:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-06-05 11:59:00", formatter));
        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("already"));
    }

    @Test
    void shouldNotCreateDuplicateShift(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(1);
        shift.setStartTime(LocalDateTime.parse("2022-06-05 08:00:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-06-05 12:00:00", formatter));
        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("already"));
    }

    @Test
    void shouldNotCreateOverlappingAtStartOfExistingShift(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(1);
        shift.setStartTime(LocalDateTime.parse("2022-06-05 06:59:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-06-05 10:59:00", formatter));
        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("already"));
    }

    @Test
    void shouldNotCreateOverlappingAtEndOfExistingShift(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(1);
        shift.setStartTime(LocalDateTime.parse("2022-06-05 10:59:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-06-05 16:59:00", formatter));
        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("already"));
    }

    @Test
    void shouldNotCreateShiftEncapsulatingExistingShift(){
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setScheduleId(2);
        shift.setEmployeeId(1);
        shift.setStartTime(LocalDateTime.parse("2022-06-05 06:00:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-06-05 16:00:00", formatter));
        shift.setEarned("someAmount");

        Result<Shift> result = service.create(shift);
        assertFalse(result.isSuccess());
        System.out.println(result.getMessages().get(0));
        assertTrue(result.getMessages().get(0).contains("already"));
    }

    @Test
    void shouldUpdate() {
        Shift shift = service.findById(7);
        shift.setEmployeeId(3);

        Result<Shift> result = service.update(shift);
        assertNotNull(result.getPayload());
        assertTrue(result.isSuccess());
    }

    @Test
    void shouldNotUpdateNonexistingShift(){
        Shift shift = service.findById(8);
        shift.setShiftId(99);

        Result<Shift> result = service.update(shift);
        assertFalse(result.isSuccess());
    }
    //since update and create use the same validation method, see above creation tests for
    //all negative tests

    @Test
    void shouldDeleteById() {
        Result<Shift> result = service.deleteById(9);

        assertTrue(result.isSuccess());
    }

    @Test
    void shouldNotDeleteByNonexistingId(){
        Result<Shift> result = service.deleteById(99);

        assertFalse(result.isSuccess());
    }
}