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
@RequestMapping("/api/shiftschedule")
public class ShiftController {
    private final ShiftService service;

    public ShiftController(ShiftService service) {
        this.service = service;
    }

    @GetMapping
    public List<Shift> findAll() throws DataAccessException {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Shift>> findById(@PathVariable int id) throws DataAccessException {
        List<Shift> shifts = service.findById(id);
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
