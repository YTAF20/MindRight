package com.mindright.controller;

import com.mindright.model.User;
import com.mindright.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        if (userService.checkIfUserExists(user.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }
        return userService.registerUser(user);
    }

    @GetMapping("/{username}")
    public User getUser(@PathVariable String username) {
        return userService.findUser(username);
    }

    @PostMapping("/enableMFA")
    public void enableMFA(@RequestBody User user) {
        userService.enableMFA(user);
    }
}
