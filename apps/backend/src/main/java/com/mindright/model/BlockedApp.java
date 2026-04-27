package com.mindright.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class BlockedApp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private String appName;
    private LocalDateTime blockStartTime;
    private LocalDateTime blockEndTime;

    public boolean isBlocked() {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(blockStartTime) && now.isBefore(blockEndTime);
    }

    // Getters and Setters


public void setBlockEndTime(LocalDateTime now) {
        this.blockEndTime = now;
    }
    public Long getId() {
        return id;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public String getAppName() {
        return appName;
    }
    public void setAppName(String appName) {
        this.appName = appName;
    }
    public LocalDateTime getBlockStartTime() {
        return blockStartTime;
    }
    public LocalDateTime getBlockEndTime() {
        return blockEndTime;
    }

}
