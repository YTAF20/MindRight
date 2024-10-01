package com.mindright.model;

import javax.persistence.*;
import lombok.Data;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;  // Enum for roles like USER, ADMIN

    // Optional fields for security
    private boolean isMFAEnabled; // Multi-factor Authentication flag
}
