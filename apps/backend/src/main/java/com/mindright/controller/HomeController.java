package com.mindright.controller;

import com.mindright.model.BlockedApp;
import com.mindright.model.Goal;
import com.mindright.model.ScreenTimeLog;
import com.mindright.service.BlockedAppService;
import com.mindright.service.GoalService;
import com.mindright.service.ScreenTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private ScreenTimeService screenTimeService;

    @Autowired
    private GoalService goalService;

    @Autowired
    private BlockedAppService blockedAppService;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        List<ScreenTimeLog> screenTimeLogs = screenTimeService.getScreenTimeLogs();
        List<Goal> goals = goalService.getGoals();
        List<BlockedApp> blockedApps = blockedAppService.getBlockedApps();

        model.addAttribute("screenTimeLogs", screenTimeLogs);
        model.addAttribute("goals", goals);
        model.addAttribute("blockedApps", blockedApps);

        return "dashboard"; // Refers to dashboard.html in templates
    }
}
