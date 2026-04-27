package com.mindright.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.security.Principal;

@Controller
public class UserController {

    @GetMapping("/dashboard")
    public String getDashboard(Model model, Principal principal) {
        // You can fetch the logged-in user's data using the principal name (username)
        model.addAttribute("username", principal.getName());
        return "dashboard";  // This refers to the Thymeleaf template `dashboard.html`
    }

    @GetMapping("/login")
    public String login() {
        return "login";  // Refers to `login.html`
    }

    @GetMapping("/register")
    public String register() {
        return "register";  // Refers to `register.html`
    }
}
