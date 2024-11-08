package com.mindright.service;

import com.mindright.model.ScreenTimeLog;
import com.mindright.model.User;
import com.mindright.repository.ScreenTimeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScreenTimeService {

    @Autowired
    private ScreenTimeLogRepository screenTimeLogRepository;
    private SimpleJpaRepository userRepository;

    public List<ScreenTimeLog> getUserScreenTimeLogs(Long userId) {
        return screenTimeLogRepository.findByUserId(userId);
    }

    public ScreenTimeLog logScreenTime(Long userId, String appName, LocalDateTime startTime, LocalDateTime endTime) {
        ScreenTimeLog log = new ScreenTimeLog();
        log.setUser((User) userRepository.findById(userId).orElseThrow());
        log.setAppName(appName);
        log.setStartTime(startTime);
        log.setEndTime(endTime);
        return screenTimeLogRepository.save(log);
    }

    public List<ScreenTimeLog> getScreenTimeLogs() {
        return screenTimeLogRepository.findAll();
    }

}
