package learn.shift_scheduler.controllers;

import learn.shift_scheduler.domain.AvailabilityService;
import learn.shift_scheduler.domain.Result;
import learn.shift_scheduler.domain.ResultType;
import learn.shift_scheduler.models.AppUser;
import learn.shift_scheduler.models.Availability;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availabilities")
public class AvailabilityController {
    private final AvailabilityService service;
    public AvailabilityController(AvailabilityService service) {
        this.service = service;
    }

    @GetMapping
    public List<Availability> findAll() throws DataAccessException {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Availability> findById(@PathVariable int id) throws DataAccessException {
        Availability availability = service.findByAvailabilityId(id);
        if (availability == null){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(availability, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Availability>> findByEmployeeId(UsernamePasswordAuthenticationToken principal) throws DataAccessException {
        AppUser appUser = (AppUser) principal.getPrincipal();
        List<Availability> availabilities = service.findByEmployeeId(appUser.getAppUserId());
        if (availabilities.size() == 0){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(availabilities, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Availability availability, UsernamePasswordAuthenticationToken principal) throws DataAccessException{
        AppUser appUser = (AppUser) principal.getPrincipal();
        availability.setEmployeeId(appUser.getAppUserId());
        Result<Availability> result = service.create(availability);
        if (!result.isSuccess()){
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/{availabilityId}")
    public ResponseEntity<?> update(@PathVariable int availabilityId, @RequestBody Availability availability) throws DataAccessException{
        if (availabilityId != availability.getAvailabilityId()){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409
        }

        Result<Availability> result = service.update(availability);
        if (!result.isSuccess()){
            if (result.getType() == ResultType.NOT_FOUND){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            else{
                return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{availabilityId}")
    public ResponseEntity<Void> deleteById(@PathVariable int availabilityId) throws DataAccessException{
        Result<Availability> result = service.deleteById(availabilityId);
        if (result.getType() == ResultType.NOT_FOUND){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
