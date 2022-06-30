package learn.shift_scheduler.models;

import java.time.LocalDateTime;
import java.util.Objects;

public class Shift {
    private int shiftId;
    private int employeeId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int scheduleId;

    private String earned = "";
    public Shift(int shiftId, int employeeId, LocalDateTime startTime, LocalDateTime endTime, int scheduleId, String earned) {
        this.shiftId = shiftId;
        this.employeeId = employeeId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.scheduleId = scheduleId;
        this.earned = earned;
    }

    public Shift() {

    }

    public int getShiftId() {
        return shiftId;
    }

    public void setShiftId(int shiftId) {
        this.shiftId = shiftId;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
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

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
    }

    public String getEarned() {
        return earned;
    }

    public void setEarned(String earned) {
        this.earned = earned;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Shift shift = (Shift) o;
        return shiftId == shift.shiftId && employeeId == shift.employeeId && scheduleId == shift.scheduleId && Objects.equals(startTime, shift.startTime) && Objects.equals(endTime, shift.endTime) && Objects.equals(earned, shift.earned);
    }

    @Override
    public int hashCode() {
        return Objects.hash(shiftId, employeeId, startTime, endTime, scheduleId, earned);
    }
}
