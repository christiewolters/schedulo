package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Availability;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AvailabilityRepository {
    List<Availability> findAll() throws DataAccessException;

    Availability findByAvailabilityId(int id) throws DataAccessException;

    List<Availability> findByEmployeeId(int id) throws DataAccessException;

    Availability create(Availability availability) throws DataAccessException;

    boolean update(Availability availability);

    @Transactional
    boolean deleteById(int id);
}
