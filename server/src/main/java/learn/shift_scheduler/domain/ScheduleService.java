package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.ScheduleRepository;
import learn.shift_scheduler.models.Schedule;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    private final ScheduleRepository repository;

    public ScheduleService(ScheduleRepository repository) {
        this.repository = repository;
    }

    public List<Schedule> findAll() throws DataAccessException {
        return repository.findAll();
    }

    public Schedule findById(int id) throws DataAccessException{
        return repository.findById(id);
    }

    public Result<Schedule> create(Schedule schedule) throws DataAccessException{
        Result<Schedule> result = validate(schedule);

        if (schedule != null && schedule.getScheduleId() > 0){
            result.addMessage("Schedule `id` should not be set.", ResultType.INVALID);
        }

        if (result.isSuccess()){
            schedule = repository.create(schedule);
            result.setPayload(schedule);
        }

        return result;
    }

    public Result<Schedule> update(Schedule schedule) throws DataAccessException{
        Result<Schedule> result = validate(schedule);

        if (schedule.getScheduleId() <= 0){
            result.addMessage("Schedule id is required.", ResultType.INVALID);
        }

        if (result.isSuccess()){
            if (repository.update(schedule)){
                result.setPayload(schedule);
            }
            else {
                result.addMessage(String.format("Schedule id with id %s not found", schedule.getScheduleId()), ResultType.NOT_FOUND);
            }
        }
        return result;
    }

    public Result<Schedule> deleteById(int id) throws DataAccessException{
        Result<Schedule> result = new Result<>();
        if (!repository.deleteById(id)){
            result.addMessage(String.format("Schedule id with id %s not found", id), ResultType.NOT_FOUND);
        }
        return result;
    }

    private Result<Schedule> validate(Schedule schedule) throws DataAccessException {
        Result<Schedule> result = new Result<>();

        if (schedule == null) {
            result.addMessage("Schedule cannot be null", ResultType.INVALID);
            return result;
        }


        if (schedule.getStartDate() == null) {
            result.addMessage("Schedule Start Date is required", ResultType.INVALID);
        }

        if (schedule.getEndDate() == null) {
            result.addMessage("Schedule End Date is required", ResultType.INVALID);
        }

        if (schedule.getEndDate().isBefore(schedule.getStartDate()) || schedule.getEndDate().isEqual(schedule.getStartDate())) {
            result.addMessage("Schedule end date must be after start date", ResultType.INVALID);
        }

        if (result.isSuccess()){
            List<Schedule> existingSchedules = repository.findAll();
            for (Schedule existingSchedule : existingSchedules){
                if( !schedule.getStartDate().isAfter(existingSchedule.getEndDate() ) &&
                        !schedule.getEndDate().isBefore(existingSchedule.getStartDate())  ){
                    result.addMessage("Schedules can not overlap", ResultType.INVALID);
                }
            }
        }

        return result;
    }
}
