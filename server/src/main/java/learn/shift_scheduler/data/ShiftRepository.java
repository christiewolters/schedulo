package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Shift;

import java.util.List;

public interface ShiftRepository {
    List<Shift> findAll();

    List<Shift> findById(int id);
}
