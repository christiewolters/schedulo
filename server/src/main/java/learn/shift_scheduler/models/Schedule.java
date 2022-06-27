package learn.shift_scheduler.models;

import java.time.LocalDate;
import java.util.Objects;

public class Schedule {
    private int scheduleId;
    private LocalDate startDate;
    private LocalDate endDate;

    public Schedule(int scheduleId, LocalDate startDate, LocalDate endDate) {
        this.scheduleId = scheduleId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Schedule() {
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Schedule schedule = (Schedule) o;
        return scheduleId == schedule.scheduleId && Objects.equals(startDate, schedule.startDate) && Objects.equals(endDate, schedule.endDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(scheduleId, startDate, endDate);
    }
}
