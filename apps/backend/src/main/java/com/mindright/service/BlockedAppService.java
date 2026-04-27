package com.mindright.service;

import com.mindright.model.BlockedApp;
import com.mindright.repository.BlockedAppRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlockedAppService {

    @Autowired
    private BlockedAppRepository blockedAppRepository;

    public BlockedApp blockApp(BlockedApp blockedApp) {
        blockedApp.getBlockStartTime();
        return blockedAppRepository.save(blockedApp);
    }

    public void unblockApp(Long id) {
        blockedAppRepository.deleteById(id);
    }

    public List<BlockedApp> getBlockedAppsForUser(Long userId) {
        return blockedAppRepository.findByUserId(userId);
    }

    public List<BlockedApp> getBlockedApps() {
        return blockedAppRepository.findAll();
    }
}
