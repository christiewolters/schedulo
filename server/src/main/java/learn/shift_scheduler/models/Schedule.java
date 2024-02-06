package learn.shift_scheduler.models;

import java.time.LocalDate;
import java.util.Objects;

public class Schedule {
    private int scheduleId;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean finalized;

    public Schedule(int scheduleId, LocalDate startDate, LocalDate endDate, boolean finalized) {
        this.scheduleId = scheduleId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.finalized = finalized;
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

    public boolean getFinalized() {
        return finalized;
    }

    public void setFinalized(boolean finalized) {
        this.finalized = finalized;
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
