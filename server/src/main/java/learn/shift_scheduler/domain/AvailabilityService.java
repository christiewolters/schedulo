package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.AvailabilityRepository;
import learn.shift_scheduler.models.Availability;

import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AvailabilityService {

    private final AvailabilityRepository repository;

    public AvailabilityService(AvailabilityRepository repository) {
        this.repository = repository;
    }

    public List<Availability> findAll() throws DataAccessException {
        return repository.findAll();
    }

    public Availability findByAvailabilityId(int id) throws DataAccessException{
        return repository.findByAvailabilityId(id);
    }

    public List<Availability> findByEmployeeId(int employee_id) throws DataAccessException{
        return repository.findByEmployeeId(employee_id);
    }

    public Result<Availability> create(Availability availability) throws DataAccessException{
        Result<Availability> result = validate(availability);

        if (availability != null && availability.getAvailabilityId() > 0){
            result.addMessage("Availability `id` should not be set.", ResultType.INVALID);
        }

        if (result.isSuccess()){
            availability = repository.create(availability);
            result.setPayload(availability);
        }

        return result;
    }

    public Result<Availability> update(Availability availability) throws DataAccessException{
        Result<Availability> result = validate(availability);

        if (availability.getAvailabilityId() <= 0){
            result.addMessage("Availability id is required.", ResultType.INVALID);
        }

        if (result.isSuccess()){
            if (repository.update(availability)){
                result.setPayload(availability);
            }
            else {
                result.addMessage(String.format("Availability id with id %s not found", availability.getAvailabilityId()), ResultType.NOT_FOUND);
            }
        }
        return result;
    }

    public Result<Availability> deleteById(int id) throws DataAccessException{
        Result<Availability> result = new Result<>();
        if (!repository.deleteById(id)){
            result.addMessage(String.format("Availability id with id %s not found", id), ResultType.NOT_FOUND);
        }
        return result;
    }

    private Result<Availability> validate(Availability availability) throws DataAccessException {
        Result<Availability> result = new Result<>();

        if (availability == null) {
            result.addMessage("Availability cannot be null", ResultType.INVALID);
            return result;
        }

        if (availability.getStartTime() == null) {
            result.addMessage("Availability Start time is required", ResultType.INVALID);
        }

        if (availability.getEndTime() == null) {
            result.addMessage("Availability End time is required", ResultType.INVALID);
        }

        if (availability.getEndTime().isBefore(availability.getStartTime()) || availability.getEndTime().isEqual(availability.getStartTime())) {
            result.addMessage("Availability end time must be after start time", ResultType.INVALID);
        }

        if (availability.getStartTime().isBefore(LocalDateTime.now())){
            result.addMessage("Availability can not start in the past", ResultType.INVALID);
        }
        if (result.isSuccess()) {
            List<Availability> existingAvailabilities = repository.findAll();

            for (Availability existingAvailability : existingAvailabilities){
                if (availability.getStartTime().isEqual(existingAvailability.getStartTime()) &&
                    availability.getEndTime().isEqual(existingAvailability.getEndTime())){
                    result.addMessage("Can not add a duplicate availability", ResultType.INVALID);
                }
            }
        }

        return result;
    }
}
