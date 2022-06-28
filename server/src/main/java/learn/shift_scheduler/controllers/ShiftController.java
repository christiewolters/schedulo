package learn.shift_scheduler.controllers;

import learn.shift_scheduler.domain.ShiftResult;
import learn.shift_scheduler.domain.ShiftService;
import learn.shift_scheduler.models.Shift;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.xml.crypto.Data;
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

    //get all shifts by schedule_id
    @GetMapping("/schedule/{schedule_id}")
    public ResponseEntity<List<Shift>> findByScheduleId(@PathVariable int schedule_id) throws DataAccessException {
        List<Shift> shifts = service.findByScheduleId(schedule_id);
        if (shifts.size() == 0){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(shifts, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Shift shift) throws DataAccessException{
        ShiftResult result = service.create(shift);
        if (!result.isSuccess()){
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getShift(), HttpStatus.CREATED);
    }
}
