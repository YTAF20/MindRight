package com.mindright.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
public class User {
    // Getters and Setters (Lombok will automatically generate these)
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    @Getter
    @Setter
    private String password;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean isMFAEnabled;  // Multi-factor Authentication flag

}
