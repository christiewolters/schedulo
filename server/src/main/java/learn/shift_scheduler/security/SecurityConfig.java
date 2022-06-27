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
                .antMatchers(HttpMethod.POST, "/api/authenticate").permitAll() // anonymous
                .antMatchers(HttpMethod.GET,
                        "/api/shiftschedule", "/api/shiftschedule/*", "/api/shiftschedule/shift/*").permitAll() // anonymous... no authentication required
                .antMatchers(HttpMethod.POST,
                        "/api/shiftschedule").hasAnyRole("EMPLOYEE", "MANAGER")
                .antMatchers(HttpMethod.PUT,
                        "/api/shiftschedule/*").hasAnyRole("EMPLOYEE", "MANAGER")
                .antMatchers(HttpMethod.DELETE,
                        "/api/shiftschedule/*").hasAnyRole("MANAGER")
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