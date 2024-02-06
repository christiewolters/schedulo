package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.AppUserJdbcTemplateRepository;
import learn.shift_scheduler.models.AppUser;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.validation.ValidationException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AppUserServiceTest {

    @Autowired
    private AppUserJdbcTemplateRepository repository;

    @Autowired
    private AppUserService service;

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
    void shouldLoadUserByUsername() {
        AppUser appUser = (AppUser) service.loadUserByUsername("john@smith.com");
        assertNotNull(appUser);
    }

    @Test
    void shouldNotLoadByUnknownUsername(){
        try{
        service.loadUserByUsername("asjkdnasd");
        }
        catch (UsernameNotFoundException ex){
            assertTrue(true);
        }
    }

    @Test
    void shouldCreate() {
        // AppUser appUser = new AppUser(0, "test@user.com", "P@ssw0rd!", false, List.of("EMPLOYEE"));

        AppUser result = service.create("test@user.com", "P@ssw0rd!", "EMPLOYEE");
        assertNotNull(result);

    }

    @Test
    void shouldNotCreateWithNullUsername(){
        try {
            service.create(null, "P@ssw0rd!", "EMPLOYEE");
        }
        catch (ValidationException ex)
        {
            assertTrue(ex.getMessage().contains("required"));
        }
    }

    @Test
    void shouldNotCreateWithBlankUsername(){
        try {
            service.create(" ", "P@ssw0rd!", "EMPLOYEE");
        }
        catch (ValidationException ex)
        {
            assertTrue(ex.getMessage().contains("required"));
        }
    }

    @Test
    void shouldNotCreateWithNullPassword(){
        try {
            service.create("testing@user", null, "EMPLOYEE");
        }
        catch (ValidationException ex)
        {
            assertTrue(ex.getMessage().contains("at least"));
        }
    }

    @Test
    void shouldNotCreateWithBlankPassword(){
        try {
            service.create("testing@user", " ", "EMPLOYEE");
        }
        catch (ValidationException ex)
        {
            assertTrue(ex.getMessage().contains("at least"));
        }
    }

    @Test
    void shouldNotCreateWithPasswordShorterThan8Characters(){
        try {
            service.create("testing@user", "abdef", "EMPLOYEE");
        }
        catch (ValidationException ex)
        {
            assertTrue(ex.getMessage().contains("at least"));
        }
    }

    @Test
    void shouldNotCreateWithWeakPassword(){
        try {
            service.create("testing@user", "abcdefghijk", "EMPLOYEE");
        }
        catch (ValidationException ex)
        {
            assertTrue(ex.getMessage().contains("must contain"));
        }
    }
}