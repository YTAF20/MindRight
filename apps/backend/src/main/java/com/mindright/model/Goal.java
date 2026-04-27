package com.mindright.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private String appName;
    private long dailyLimitInMinutes;
}
