package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Shift;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class ShiftJdbcTemplateRepository implements ShiftRepository{
    private final JdbcTemplate jdbcTemplate;

    public ShiftJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final RowMapper<Shift> mapper = (resultSet, rowIndex) -> {
        Shift shift = new Shift();

        shift.setShiftId(resultSet.getInt("shift_id"));
        shift.setEmployeeId(resultSet.getInt("employee_id"));

        LocalDateTime start = LocalDateTime.parse(resultSet.getString("start_time"), formatter);
        shift.setStartTime(start);

        LocalDateTime end = LocalDateTime.parse(resultSet.getString("end_time"), formatter);
        shift.setEndTime(end);

        shift.setScheduleId(resultSet.getInt("schedule_id"));
        return shift;

    };

    @Override
    public List<Shift> findAll() throws DataAccessException{
        final String sql = "select shift_id, employee_id, start_time, end_time, schedule_id from shift;";

        return jdbcTemplate.query(sql, mapper);
    }

    @Override
    public List<Shift> findById(int id) throws DataAccessException{
        final String sql = "select shift_id, employee_id, start_time, end_time, schedule_id from shift where employee_id = ?;";

        return jdbcTemplate.query(sql, mapper, id);
    }

    @Override
    public Shift create(Shift shift) throws DataAccessException{
        final String sql = "insert into shift (employee_id, start_time, end_time, schedule_id) " +
                "values (?,?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, shift.getEmployeeId());
            statement.setString(2,    shift.getStartTime().toString());
            statement.setString(3,    shift.getEndTime().toString());
            statement.setInt(4,    shift.getScheduleId());
            return statement;
        }, keyHolder);
        if (rowsAffected == 0) {
            return null;
        }
        shift.setShiftId(keyHolder.getKey().intValue());

        return shift;
    }
}
