package learn.shift_scheduler.data;

import learn.shift_scheduler.domain.Result;
import learn.shift_scheduler.models.AppUser;
import learn.shift_scheduler.models.Schedule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AppUserJdbcTemplateRepositoryTest {

    @Autowired
    private AppUserJdbcTemplateRepository repository;

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
    void findByUsername() {
        AppUser result = repository.findByUsername("john@smith.com");
        assertNotNull(result);
    }

    @Test
    void shouldCreate() {
        AppUser user = new AppUser(0, "test@user.com","P@ssw0rd!", false, List.of("EMPLOYEE"));
        Result<AppUser> result = new Result<>();
        result.setPayload(repository.create(user));
        assertNotNull(result.getPayload());
        assertTrue(result.isSuccess());
    }

    //update not used
}