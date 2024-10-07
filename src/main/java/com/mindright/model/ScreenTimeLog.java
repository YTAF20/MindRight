package com.mindright.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ScreenTimeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private String appName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public long getTotalTimeSpent() {
        return java.time.Duration.between(startTime, endTime).toMinutes();
    }

    // Getters and Setters
}
