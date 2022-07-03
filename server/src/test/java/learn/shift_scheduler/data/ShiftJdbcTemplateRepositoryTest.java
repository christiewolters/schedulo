package learn.shift_scheduler.data;

import learn.shift_scheduler.domain.Result;
import learn.shift_scheduler.models.Shift;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ShiftJdbcTemplateRepositoryTest {

    @Autowired
    private ShiftJdbcTemplateRepository repository;

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
    void shouldFindAll() throws DataAccessException{
        List<Shift> result = repository.findAll();
        assertNotNull(result);
        assertTrue(result.size() >= 4);
    }

    @Test
    void shouldFindById() {
        Shift result = repository.findById(1);
        assertNotNull(result);
    }

    @Test
    void shouldFindByEmployeeId() {
        List<Shift> result = repository.findByEmployeeId(1);
        assertTrue(result.size() > 0);

    }

    @Test
    void shouldFindByScheduleId() {
        List<Shift> result = repository.findByScheduleId(1);
        assertTrue(result.size() >= 3);
    }

    @Test
    void shouldCreate() {
        Shift shift = new Shift();
        shift.setShiftId(0);
        shift.setEmployeeId(2);
        shift.setScheduleId(2);
        shift.setStartTime(LocalDateTime.parse("2022-06-05 20:00:00", formatter));
        shift.setEndTime(LocalDateTime.parse("2022-06-05 22:00:00", formatter));

        Result<Shift> result = new Result<>();
        result.setPayload(repository.create(shift));
        assertNotNull(result.getPayload());
        assertTrue(result.isSuccess());

    }

    @Test
    void shouldUpdate() {
        Shift shift = repository.findById(6);
        shift.setEmployeeId(3);

        assertTrue(repository.update(shift));
    }

    @Test
    void shouldDeleteById() {
        assertTrue(repository.deleteById(5));
    }

}
