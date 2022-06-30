package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Schedule;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ScheduleRepository {
    List<Schedule> findAll() throws DataAccessException;

    Schedule findById(int id) throws DataAccessException;

    Schedule create(Schedule schedule) throws DataAccessException;

    boolean update(Schedule schedule);

    @Transactional
    boolean deleteById(int id);
}
