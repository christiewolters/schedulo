package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.ShiftRepository;
import learn.shift_scheduler.models.Shift;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    public List<Shift> findAllByEmployeeId(int employee_id) {
        return repository.findAllByEmployeeId(employee_id);
    }

    //find all shifts with username
    public List<Shift> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    //find all shifts with schedule_id
    public List<Shift> findByScheduleId(int schedule_id) throws DataAccessException{
        return repository.findByScheduleId(schedule_id);
    }
    //find shifts with schedule id and user id
    public List<Shift> findByScheduleEmployeeId(int schedule_id, int employee_id) {
        return repository.findByScheduleEmployeeId(schedule_id, employee_id);
    }

    public Result<Shift> create(Shift shift) throws DataAccessException{
        Result<Shift> result = validate(shift);

        if (shift != null && shift.getShiftId() > 0){
            result.addMessage("Shift `id` should not be set.", ResultType.INVALID);
        }

        if (result.isSuccess()){
            shift = repository.create(shift);
            result.setPayload(shift);
        }

        return result;
    }

    public Result<Shift> update(Shift shift) throws DataAccessException{
        Result<Shift> result = validate(shift);

        if (shift.getShiftId() <= 0){
            result.addMessage("Shift id is required.", ResultType.INVALID);
        }

        if (result.isSuccess()){
            if (repository.update(shift)){
                result.setPayload(shift);
            }
            else {
                result.addMessage(String.format("Shift id with id %s not found", shift.getShiftId()), ResultType.NOT_FOUND);
            }
        }
        return result;
    }

    public Result<Shift> deleteById(int id) throws DataAccessException{
        Result<Shift> result = new Result<>();
        if (!repository.deleteById(id)){
            result.addMessage(String.format("Shift id with id %s not found", id), ResultType.NOT_FOUND);
        }
        return result;
    }

    private Result<Shift> validate(Shift shift) throws DataAccessException{
        Result<Shift> result = new Result<>();

        if (shift == null){
            result.addMessage("Shift cannot be null", ResultType.INVALID);
            return result;
        }

        if (shift.getStartTime() == null){
            result.addMessage("Shift Start time is required", ResultType.INVALID);
            return result;
        }

        if (shift.getEndTime() == null){
            result.addMessage("Shift End time is required", ResultType.INVALID);
            return result;
        }

        if (shift.getEndTime().isBefore(shift.getStartTime()) || shift.getEndTime().isEqual(shift.getStartTime())){
            result.addMessage("Shift end time must be after start time", ResultType.INVALID);
        }

        if (shift.getScheduleId() <= 0){
            result.addMessage("Shift must be assigned to a schedule", ResultType.INVALID);
        }

        if (shift.getStartTime().isBefore(LocalDateTime.now())){
            result.addMessage("Shift can not start in the past", ResultType.INVALID);
        }

        if (shift.getEarned() == null || shift.getEarned().isBlank()){
            result.addMessage("Earned amount is required (Dinero Object String)", ResultType.INVALID);
            return result;
        }

        //validates that new shift does not overlap an existing shift
        if (result.isSuccess() && shift.getEmployeeId() != 0){
            List<Shift> existingShifts = repository.findAllByEmployeeId(shift.getEmployeeId());
             for (Shift existingShift : existingShifts){
                 //date range overlaps
                if( (existingShift.getStartTime().isBefore(shift.getEndTime() ) ||
                        existingShift.getStartTime().isEqual(shift.getEndTime()))
                        &&
                        (existingShift.getEndTime().isAfter(shift.getStartTime()) ||
                                existingShift.getEndTime().isEqual(shift.getStartTime()))  ){
                    result.addMessage("Employee is already assigned to a shift at that time.", ResultType.INVALID);
                    return result;
                }

             }

        }

        return result;
    }



}
