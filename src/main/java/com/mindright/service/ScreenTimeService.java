package com.mindright.service;

import com.mindright.model.ScreenTimeLog;
import com.mindright.repository.ScreenTimeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScreenTimeService {

    @Autowired
    private ScreenTimeLogRepository screenTimeLogRepository;

    public List<ScreenTimeLog> getUserScreenTimeLogs(Long userId) {
        return screenTimeLogRepository.findByUserId(userId);
    }

    public ScreenTimeLog startLog(ScreenTimeLog log) {
        log.setStartTime(LocalDateTime.now());
        return screenTimeLogRepository.save(log);
    }

    public ScreenTimeLog endLog(Long logId) {
        ScreenTimeLog log = screenTimeLogRepository.findById(logId).orElseThrow(() -> new RuntimeException("Log not found"));
        log.setEndTime(LocalDateTime.now());
        return screenTimeLogRepository.save(log);
    }
}
