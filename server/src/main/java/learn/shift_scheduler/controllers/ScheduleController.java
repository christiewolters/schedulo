package learn.shift_scheduler.controllers;

import learn.shift_scheduler.domain.Result;
import learn.shift_scheduler.domain.ResultType;
import learn.shift_scheduler.domain.ScheduleService;
import learn.shift_scheduler.models.Schedule;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService service;

    public ScheduleController(ScheduleService service) {
        this.service = service;
    }

    @GetMapping
    public List<Schedule> findAll() throws DataAccessException{
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> findById(@PathVariable int id) throws DataAccessException {
        Schedule schedule = service.findById(id);
        if (schedule == null){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(schedule, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Schedule schedule) throws DataAccessException{
        Result<Schedule> result = service.create(schedule);
        if (!result.isSuccess()){
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/{scheduleId}")
    public ResponseEntity<?> update(@PathVariable int scheduleId, @RequestBody Schedule schedule) throws DataAccessException{
        if (scheduleId != schedule.getScheduleId()){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409
        }

        Result<Schedule> result = service.update(schedule);
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

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteById(@PathVariable int scheduleId) throws DataAccessException{
        Result<Schedule> result = service.deleteById(scheduleId);
        if (result.getType() == ResultType.NOT_FOUND){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
