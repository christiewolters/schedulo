package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.ShiftRepository;
import learn.shift_scheduler.models.Shift;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ShiftService {

    private final ShiftRepository repository;

    public ShiftService(ShiftRepository repository) {
        this.repository = repository;
    }

    //Get all shifts in the database
    public List<Shift> findAll() throws DataAccessException{
        return repository.findAll();
    }

    //find single shift by shift_id
    public Shift findById(int id) throws DataAccessException{
        return repository.findById(id);
    }

    //find all shifts with employee_id
    public List<Shift> findByEmployeeId(int employee_id) throws DataAccessException{
        return repository.findByEmployeeId(employee_id);
    }

    //find all shifts with schedule_id
    public List<Shift> findByScheduleId(int schedule_id) throws DataAccessException{
        return repository.findByScheduleId(schedule_id);
    }

    public ShiftResult create(Shift shift) throws DataAccessException{
        ShiftResult result = validate(shift);

        if (shift != null && shift.getShiftId() > 0){
            result.addErrorMessage("Shift `id` should not be set.", ResultType.INVALID);
        }

        if (result.isSuccess()){
            shift = repository.create(shift);
            result.setShift(shift);
        }

        return result;
    }

    private ShiftResult validate(Shift shift) throws DataAccessException{
        ShiftResult result = new ShiftResult();

        if (shift == null){
            result.addErrorMessage("Shift cannot be null", ResultType.INVALID);
            return result;
        }

/*          Removing - shift can be created but yet to be assigned to an employee (i.e. no employee available for shift)
            if (shift.getEmployeeId() < 1){
            result.addErrorMessage("Employee Id must be greater than 0", ResultType.INVALID);
        }*/

        if (shift.getStartTime() == null){
            result.addErrorMessage("Shift Start time is required", ResultType.INVALID);
        }

        if (shift.getEndTime() == null){
            result.addErrorMessage("Shift End time is required", ResultType.INVALID);
        }

        if (shift.getScheduleId() <= 0){
            result.addErrorMessage("Shift must be assigned to a schedule", ResultType.INVALID);
        }

        //validates that new shift does not overlap an existing shift
        if (result.isSuccess() && shift.getEmployeeId() != 0){
            List<Shift> existingShifts = repository.findByEmployeeId(shift.getEmployeeId());
            LocalDate existingDate = null;
             for (Shift existingShift : existingShifts){
                 //date range overlaps
                if( !shift.getStartTime().isAfter(existingShift.getEndTime() ) &&
                        !shift.getEndTime().isBefore(existingShift.getStartTime())  ){
                    result.addErrorMessage("Employee is already assigned to a shift at that time.", ResultType.INVALID);
                }
             }

        }

        return result;
    }
}
