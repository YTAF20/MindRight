package com.mindright.controller;

import com.mindright.model.User;
import com.mindright.service.UserService;
import com.mindright.service.ScreenTimeService;
import com.mindright.service.GoalService;
import com.mindright.service.BlockedAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @Autowired
    private UserService userService;

    @Autowired
    private ScreenTimeService screenTimeService;

    @Autowired
    private GoalService goalService;

    @Autowired
    private BlockedAppService blockedAppService;

    @GetMapping("/dashboard")
    public String showDashboard(Model model) {
        User user = userService.getLoggedInUser();
        model.addAttribute("screenTimeLogs", screenTimeService.getUserScreenTimeLogs(user.getId()));
        model.addAttribute("goals", goalService.getUserGoals(user.getId()));
        model.addAttribute("blockedApps", blockedAppService.getBlockedAppsForUser(user.getId()));
        return "dashboard";
    }
}
