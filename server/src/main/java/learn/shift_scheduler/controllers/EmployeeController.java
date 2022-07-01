package learn.shift_scheduler.controllers;

import learn.shift_scheduler.domain.EmployeeService;
import learn.shift_scheduler.domain.Result;
import learn.shift_scheduler.domain.ResultType;
import learn.shift_scheduler.models.AppUser;
import learn.shift_scheduler.models.Employee;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Employee> findAll() throws DataAccessException{
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> findById(@PathVariable int id, UsernamePasswordAuthenticationToken principal){
        Employee employee = service.findById(id);
        if (employee == null){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    @GetMapping("/employee")
    public ResponseEntity<Employee> findByUser(UsernamePasswordAuthenticationToken principal) throws DataAccessException{
        AppUser appUser = (AppUser) principal.getPrincipal();



        Employee employee = service.findById(appUser.getAppUserId());
        if (employee == null){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<Employee> findByUsername(@PathVariable String username){
        Employee employee = service.findByUsername(username);
        if (employee == null){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Employee employee) throws DataAccessException{
        Result<Employee> result = service.create(employee);
        if (!result.isSuccess()){
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Employee employee) throws DataAccessException{
        if (id != employee.getEmployeeId()){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409
        }

        Result<Employee> result = service.update(employee);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable int id) throws DataAccessException{
        Result<Employee> result = service.deleteById(id);
        if (result.getType() == ResultType.NOT_FOUND){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
