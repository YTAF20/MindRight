package com.mindright.repository;

import com.mindright.model.ScreenTimeLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScreenTimeLogRepository extends JpaRepository<ScreenTimeLog, Long> {
    List<ScreenTimeLog> findByUserId(Long userId);
}
