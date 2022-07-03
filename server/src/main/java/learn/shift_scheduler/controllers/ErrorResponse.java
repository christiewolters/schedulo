package learn.shift_scheduler.controllers;

import java.time.LocalDateTime;

public class ErrorResponse {
    private final LocalDateTime timestamp = LocalDateTime.now();
    private final String message;

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public ErrorResponse(String message) {
        this.message = message;
    }
}
