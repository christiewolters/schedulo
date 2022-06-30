package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Shift;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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
        shift.setScheduleId(resultSet.getInt("schedule_id"));
        shift.setEmployeeId(resultSet.getInt("employee_id"));

        LocalDateTime start = LocalDateTime.parse(resultSet.getString("start_time"), formatter);
        shift.setStartTime(start);

        LocalDateTime end = LocalDateTime.parse(resultSet.getString("end_time"), formatter);
        shift.setEndTime(end);

        return shift;
    };

    @Override
    public List<Shift> findAll() throws DataAccessException{
        final String sql = "select shift_id, employee_id, start_time, end_time, schedule_id from shift;";

        return jdbcTemplate.query(sql, mapper);
    }

    @Override
    public Shift findById(int id) throws DataAccessException{
        final String sql = "select shift_id, employee_id, start_time, end_time, schedule_id from shift where shift_id = ?;";

        return jdbcTemplate.query(sql, mapper, id).stream().findFirst().orElse(null);
    }

    @Override
    public List<Shift> findByEmployeeId(int employeeId) throws DataAccessException{
        final String byEmployeeIdSql = "select * from (select s.shift_id, s.schedule_id, s.employee_id, s.start_time, s.end_time from shift s " +
                "inner join `schedule` sc on s.schedule_id = sc.schedule_id where sc.finalized = 1 order by start_time asc) " +
                "finalized where finalized.employee_id = ?;";

        return jdbcTemplate.query(byEmployeeIdSql, mapper, employeeId);
    }

    @Override
    public List<Shift> findByUsername(String username) throws DataAccessException{
        final String byUsernameSql = "select s.shift_id, s.schedule_id, s.employee_id, s.start_time, s.end_time from app_user au " +
                "left outer join employee e on au.app_user_id = e.app_user_id " +
                "left outer join shift s on e.employee_id = s.employee_id " +
                "left outer join schedule sh on s.schedule_id = sh.schedule_id " +
                "where au.username = ? and sh.finalized = 1 " +
                "order by start_time asc;";

        return jdbcTemplate.query(byUsernameSql, mapper, username);
    }

    @Override
    public List<Shift> findByScheduleId(int schedule_id) throws DataAccessException{
        final String sql = "select shift_id, employee_id, start_time, end_time, schedule_id from shift where schedule_id = ? ;";

        return jdbcTemplate.query(sql, mapper, schedule_id);
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

    @Override
    public boolean update(Shift shift){
        final String sql = "update shift set " +
                "schedule_id = ?, " +
                "employee_id = ?, " +
                "start_time = ?, " +
                "end_time = ? " +
                "where shift_id = ?";

        return jdbcTemplate.update(sql,
                shift.getScheduleId(),
                shift.getEmployeeId(),
                shift.getStartTime(),
                shift.getEndTime(),
                shift.getShiftId()) > 0;
    }

    @Override
    @Transactional
    public boolean deleteById(int id){
        return jdbcTemplate.update("delete from shift where shift_id = ?", id) > 0;
    }
}
