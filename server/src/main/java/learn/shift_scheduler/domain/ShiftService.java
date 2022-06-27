package learn.shift_scheduler.domain;

import learn.shift_scheduler.data.ShiftRepository;
import learn.shift_scheduler.models.Shift;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ShiftService {

    private final ShiftRepository repository;

    public ShiftService(ShiftRepository repository) {
        this.repository = repository;
    }

    public List<Shift> findAll(){
        return repository.findAll();
    }

    public List<Shift> findById(int id){
        return repository.findById(id);
    }
}
