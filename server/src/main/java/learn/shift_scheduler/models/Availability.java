package learn.shift_scheduler.models;

import java.time.LocalDateTime;
import java.util.Objects;

public class Availability {
    private int availabilityId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int employeeId;

    public Availability(int availabilityId, LocalDateTime startTime, LocalDateTime endTime, int employeeId) {
        this.availabilityId = availabilityId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.employeeId = employeeId;
    }

    public int getAvailabilityId() {
        return availabilityId;
    }

    public void setAvailabilityId(int availabilityId) {
        this.availabilityId = availabilityId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Availability that = (Availability) o;
        return availabilityId == that.availabilityId && employeeId == that.employeeId && Objects.equals(startTime, that.startTime) && Objects.equals(endTime, that.endTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(availabilityId, startTime, endTime, employeeId);
    }
}
