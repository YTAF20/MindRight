package com.mindright.controller;

import com.mindright.model.ScreenTimeLog;
import com.mindright.service.ScreenTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/start")
    public ScreenTimeLog startLog(@RequestBody ScreenTimeLog log) {
        return screenTimeService.startLog(log);
    }

    @PostMapping("/end/{logId}")
    public ScreenTimeLog endLog(@PathVariable Long logId) {
        return screenTimeService.endLog(logId);
    }
}
