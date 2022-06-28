package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Shift;
import org.springframework.dao.DataAccessException;

import java.util.List;

public interface ShiftRepository {

    //Returns list of all shifts in the database
    List<Shift> findAll();

    //Get single shift by shift_id
    Shift findById(int id);

    //Get all shifts by employee_id
    List<Shift> findByEmployeeId(int id);

    //Get all shifts by schedule_id
    List<Shift> findByScheduleId(int id);

    //Add shift to database
    Shift create(Shift shift) throws DataAccessException;
}
