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
}
