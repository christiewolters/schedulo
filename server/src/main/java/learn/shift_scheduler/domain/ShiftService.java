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

    public List<Shift> findAll() throws DataAccessException{
        return repository.findAll();
    }

    public List<Shift> findById(int id) throws DataAccessException{
        return repository.findById(id);
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

        if (shift.getEmployeeId() < 1){
            result.addErrorMessage("Employee Id must be greater than 0", ResultType.INVALID);
        }

        if (shift.getStartTime() == null){
            result.addErrorMessage("Shift Start time is required", ResultType.INVALID);
        }

        if (shift.getEndTime() == null){
            result.addErrorMessage("Shift End time is required", ResultType.INVALID);
        }

        if (shift.getScheduleId() <= 0){
            result.addErrorMessage("Schedule Id must be greater than 0", ResultType.INVALID);
        }

        if (result.isSuccess()){
            List<Shift> existingShifts = repository.findById(shift.getEmployeeId());
            LocalDate existingDate = null;
             for (Shift existingShift : existingShifts){
                existingDate = existingShift.getStartTime().toLocalDate();
                if (shift.getStartTime().toLocalDate().isEqual(existingDate) ||
                    shift.getEndTime().toLocalDate().isEqual(existingDate)){
                    result.addErrorMessage("Employees can only have one shift per day.", ResultType.INVALID);
                }
             }

        }

        return result;
    }
}
