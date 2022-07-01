package learn.shift_scheduler.security;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final JwtConverter jwtConverter;

    public SecurityConfig(JwtConverter jwtConverter) {
        this.jwtConverter = jwtConverter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.cors();

        http.authorizeRequests()
                .antMatchers(HttpMethod.POST, "/api/authenticate").permitAll()
                .antMatchers(HttpMethod.GET,
                        "/api/shifts/user",
                        "/api/availabilities/user",
                        "/api/employees/employee").hasAnyRole("EMPLOYEE", "MANAGER")
                .antMatchers(HttpMethod.GET,
                        "/api/shifts",
                        "/api/shifts/**",
                        "/api/availabilities",
                        "/api/employees",
                        "/api/employees/**",
                        "/api/schedules/*",
                        "/api/schedules",
                        "/api/availabilities/**").hasAnyRole("MANAGER")
                .antMatchers(HttpMethod.POST,
                        "/api/availabilities").hasAnyRole("EMPLOYEE", "MANAGER")
                .antMatchers(HttpMethod.POST,
                        "/api/shifts",
                        "/api/employees",
                        "/api/schedules").hasAnyRole("MANAGER")
                .antMatchers(HttpMethod.PUT,
                        "/api/availabilities/*").hasAnyRole("EMPLOYEE", "MANAGER")
                .antMatchers(HttpMethod.PUT,
                        "/api/shifts/*",
                        "/api/employees/*",
                        "/api/schedules/*").hasAnyRole("MANAGER")
                .antMatchers(HttpMethod.DELETE,
                        "/api/availabilities/*").hasAnyRole("EMPLOYEE")
                .antMatchers(HttpMethod.DELETE,
                        "/api/schedules/*",
                        "/api/shifts/*",
                        "/api/employees/*").hasAnyRole("MANAGER")
                .antMatchers("/**").denyAll()
                .and()
                .addFilter(new JwtRequestFilter(authenticationManager(), jwtConverter))
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    @Bean
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }
}