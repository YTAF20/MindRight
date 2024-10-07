package com.mindright.service;

import com.mindright.model.ScreenTimeLog;
import com.mindright.model.User;
import com.mindright.repository.ScreenTimeLogRepository;
import com.mindright.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScreenTimeService {

    @Autowired
    private ScreenTimeLogRepository screenTimeLogRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ScreenTimeLog> getUserScreenTimeLogs(Long userId) {
        return screenTimeLogRepository.findByUserId(userId);
    }

    public ScreenTimeLog logScreenTime(Long userId, String appName, LocalDateTime startTime, LocalDateTime endTime) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        ScreenTimeLog log = new ScreenTimeLog();
        log.setUser(user);
        log.setAppName(appName);
        log.setStartTime(startTime);
        log.setEndTime(endTime);

        return screenTimeLogRepository.save(log);
    }
}
