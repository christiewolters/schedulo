package learn.shift_scheduler.data;

import learn.shift_scheduler.models.Availability;
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
public class AvailabilityJdbcTemplateRepository implements AvailabilityRepository{
    private final JdbcTemplate jdbcTemplate;

    public AvailabilityJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final RowMapper<Availability> mapper = (resultSet, rowIndex) -> {
        Availability availability = new Availability();

        availability.setAvailabilityId(resultSet.getInt("availability_id"));

        LocalDateTime start = LocalDateTime.parse(resultSet.getString("start_time"), formatter);
        availability.setStartTime(start);

        LocalDateTime end = LocalDateTime.parse(resultSet.getString("end_time"), formatter);
        availability.setEndTime(end);

        availability.setEmployeeId(resultSet.getInt("employee_id"));

        return availability;
    };

    @Override
    public List<Availability> findAll() throws DataAccessException {
        final String sql = "select availability_id, start_time, end_time, employee_id from availability " +
                "order by employee_id asc, start_time asc;";

        return jdbcTemplate.query(sql, mapper);
    }

    @Override
    public Availability findByAvailabilityId(int id) throws DataAccessException{
        final String sql = "select availability_id, start_time, end_time, employee_id from availability where availability_id = ?;";

        return jdbcTemplate.query(sql, mapper, id).stream().findFirst().orElse(null);
    }

    @Override
    public List<Availability> findByEmployeeId(int id) throws DataAccessException{
        final String sql = "select availability_id, start_time, end_time, employee_id from availability where employee_id = ? " +
                "order by start_time desc;";
        return jdbcTemplate.query(sql, mapper, id);
    }

    @Override
    public Availability create(Availability availability) throws DataAccessException{
        final String sql = "insert into availability (start_time, end_time, employee_id) " +
                "values (?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1,    availability.getStartTime().toString());
            statement.setString(2,    availability.getEndTime().toString());
            statement.setInt(3, availability.getEmployeeId());
            return statement;
        }, keyHolder);
        if (rowsAffected == 0) {
            return null;
        }
        availability.setAvailabilityId(keyHolder.getKey().intValue());

        return availability;
    }

    @Override
    public boolean update(Availability availability){
        final String sql = "update availability set " +
                "start_time = ?, " +
                "end_time = ?, " +
                "employee_id = ? " +
                "where availability_id = ?;";

        return jdbcTemplate.update(sql,
                availability.getStartTime().toString(),
                availability.getEndTime().toString(),
                availability.getEmployeeId(),
                availability.getAvailabilityId()) > 0;
    }

    @Override
    @Transactional
    public boolean deleteById(int id){
        return jdbcTemplate.update("delete from availability where availability_id = ?", id) > 0;
    }

}
