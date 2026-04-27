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



public void setUser(User user) {
        this.user = user;
    }
    public User getUser() {
        return user;
    }
    public String getAppName() {
        return appName;
    }
    public void setAppName(String appName) {
        this.appName = appName;
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
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }


}
