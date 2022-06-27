package learn.shift_scheduler.domain;

import learn.shift_scheduler.models.Shift;

import java.util.ArrayList;
import java.util.List;

public class ShiftResult {
    private final ArrayList<String> messages = new ArrayList<>();
    private Shift shift;
    private ResultType resultType = ResultType.SUCCESS;

    public List<String> getErrorMessages() {
        return new ArrayList<>(messages);
    }

    public void addErrorMessage(String message, ResultType resultType) {
        messages.add(message);
        this.resultType = resultType;
    }

    public void addErrorMessage(String format, ResultType resultType, Object... args) {
        messages.add(String.format(format, args));
        this.resultType = resultType;
    }

    public boolean isSuccess() {
        return resultType == ResultType.SUCCESS;
    }

    public ResultType getResultType() {
        return this.resultType;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }
}