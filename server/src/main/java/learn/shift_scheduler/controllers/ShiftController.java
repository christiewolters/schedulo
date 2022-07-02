package learn.shift_scheduler.controllers;

import learn.shift_scheduler.domain.Result;
import learn.shift_scheduler.domain.ResultType;
import learn.shift_scheduler.domain.ShiftService;
import learn.shift_scheduler.models.Shift;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {
    private final ShiftService service;

    public ShiftController(ShiftService service) {
        this.service = service;
    }

    //Get all shifts for all employees
    @GetMapping
    public List<Shift> findAll() throws DataAccessException {
        return service.findAll();
    }

    //get single shift by shift_id
    @GetMapping("/{id}")
    public ResponseEntity<Shift> findById(@PathVariable int id) throws DataAccessException {
        Shift shift = service.findById(id);
        if (shift == null){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(shift, HttpStatus.OK);
    }

    //get all shifts by employee_id
    @GetMapping("/employee/{employee_id}")
    public ResponseEntity<List<Shift>> findByEmployeeId(@PathVariable int employee_id) throws DataAccessException {
        List<Shift> shifts = service.findByEmployeeId(employee_id);
        if (shifts.size() == 0){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(shifts, HttpStatus.OK);
    }

    //get all shifts by username
    @GetMapping("/user/{username}")
    public ResponseEntity<List<Shift>> findByUsername(@PathVariable String username) throws DataAccessException {
        List<Shift> shifts = service.findByUsername(username);
        if (shifts.size() == 0){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(shifts, HttpStatus.OK);
    }

    //get all shifts by schedule_id
    @GetMapping("/schedule/{schedule_id}")
    public ResponseEntity<List<Shift>> findByScheduleId(@PathVariable int schedule_id) throws DataAccessException {
        List<Shift> shifts = service.findByScheduleId(schedule_id);
        if (shifts.size() == 0){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(shifts, HttpStatus.OK);
    }


    //get all employee's shifts in a schedule
    @GetMapping("/schedule/{schedule_id}/employee/{employee_id}")
    public ResponseEntity<List<Shift>> findByScheduleEmployeeId(@PathVariable("schedule_id") int schedule_id, @PathVariable("employee_id") int employee_id) throws DataAccessException {
        List<Shift> shifts = service.findByScheduleEmployeeId(schedule_id, employee_id);
        if (shifts.size() == 0){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(shifts, HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<?> create(@RequestBody Shift shift) throws DataAccessException{
        Result<Shift> result = service.create(shift);
        if (!result.isSuccess()){
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/{shift_id}")
    public ResponseEntity<?> update(@PathVariable int shift_id, @RequestBody Shift shift) throws DataAccessException{
        if (shift_id != shift.getShiftId()){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409
        }

        Result<Shift> result = service.update(shift);
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

    @DeleteMapping("/{shift_id}")
    public ResponseEntity<Void> deleteById(@PathVariable int shift_id) throws DataAccessException{
        Result<Shift> result = service.deleteById(shift_id);
        if (result.getType() == ResultType.NOT_FOUND){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
