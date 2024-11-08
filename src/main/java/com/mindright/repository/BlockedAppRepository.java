package com.mindright.repository;

import com.mindright.model.BlockedApp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlockedAppRepository extends JpaRepository<BlockedApp, Long> {
    List<BlockedApp> findByUserId(Long userId);
}
