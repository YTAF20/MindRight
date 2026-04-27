package com.mindright.controller;

import com.mindright.model.ScreenTimeLog;
import com.mindright.service.ScreenTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/screentime")
public class ScreenTimeController {

    @Autowired
    private ScreenTimeService screenTimeService;

    @GetMapping("/user/{userId}")
    public List<ScreenTimeLog> getUserLogs(@PathVariable Long userId) {
        return screenTimeService.getUserScreenTimeLogs(userId);
    }

    @PostMapping("/log")
    public ScreenTimeLog logScreenTime(
            @RequestParam Long userId,
            @RequestParam String appName,
            @RequestParam String startTime,
            @RequestParam String endTime) {

        LocalDateTime start = LocalDateTime.parse(startTime);
        LocalDateTime end = LocalDateTime.parse(endTime);
        return screenTimeService.logScreenTime(userId, appName, start, end);
    }
}
