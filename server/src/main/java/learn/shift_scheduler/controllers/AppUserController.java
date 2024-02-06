package learn.shift_scheduler.controllers;

import learn.shift_scheduler.domain.AppUserService;
import learn.shift_scheduler.models.AppUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.ValidationException;
import java.util.List;
import java.util.Map;

@RestController
public class AppUserController {
    private final AppUserService service;

    public AppUserController(AppUserService service) {
        this.service = service;
    }

    @PostMapping("/api/appuser")
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        try {
            AppUser appUser = service.create(body.get("username"), body.get("password"), body.get("role"));
            return new ResponseEntity<>(appUser, HttpStatus.CREATED); // 201
        } catch (ValidationException ex) {
            return new ResponseEntity<>(List.of(ex.getMessage()), HttpStatus.BAD_REQUEST); // 400
        }
    }
}
