package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Schedule;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class ScheduleJdbcTemplateRepository implements ScheduleRepository {
    private final JdbcTemplate jdbcTemplate;

    public ScheduleJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final RowMapper<Schedule> mapper = (resultSet, rowIndex) -> {
        Schedule schedule = new Schedule();

        schedule.setScheduleId(resultSet.getInt("schedule_id"));

        LocalDate start = LocalDate.parse(resultSet.getString("start_date"), formatter);
        schedule.setStartDate(start);

        LocalDate end = LocalDate.parse(resultSet.getString("end_date"), formatter);
        schedule.setEndDate(end);
        schedule.setFinalized(resultSet.getBoolean("finalized"));


        return schedule;
    };

    @Override
    public List<Schedule> findAll() throws DataAccessException{
        final String sql = "select schedule_id, start_date, end_date, finalized from `schedule`;";

        return jdbcTemplate.query(sql, mapper);
    }

    @Override
    public Schedule findById(int id) throws DataAccessException{
        final String sql = "select schedule_id, start_date, end_date, finalized from `schedule` where schedule_id = ?;";

        return jdbcTemplate.query(sql, mapper, id).stream().findFirst().orElse(null);
    }

    @Override
    public Schedule create(Schedule schedule) throws DataAccessException{
        final String sql = "insert into `schedule` (start_date, end_date, finalized) " +
                "values (?,?,?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1,    schedule.getStartDate().toString());
            statement.setString(2,    schedule.getEndDate().toString());
            statement.setBoolean(3,    schedule.getFinalized());
            return statement;
        }, keyHolder);
        if (rowsAffected == 0) {
            return null;
        }
        schedule.setScheduleId(keyHolder.getKey().intValue());

        return schedule;
    }

    @Override
    public boolean update(Schedule schedule){
        final String sql = "update schedule set " +
                "start_date = ?, " +
                "end_date = ?, " +
                "finalized = ?, " +
                "where schedule_id = ?;";

        return jdbcTemplate.update(sql,
                schedule.getStartDate().toString(),
                schedule.getEndDate().toString(),
                schedule.getFinalized()) > 0;
    }

    @Override
    @Transactional
    public boolean deleteById(int id){
        jdbcTemplate.update("delete from shift where schedule_id = ?;", id);
        return jdbcTemplate.update("delete from `schedule` where schedule_id = ?;", id) > 0;
    }

}

