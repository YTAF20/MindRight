package com.mindright.controller;

import com.mindright.model.BlockedApp;
import com.mindright.service.BlockedAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blockedapps")
public class BlockedAppController {

    @Autowired
    private BlockedAppService blockedAppService;

    @PostMapping("/block")
    public BlockedApp blockApp(@RequestBody BlockedApp blockedApp) {
        return blockedAppService.blockApp(blockedApp);
    }

    @DeleteMapping("/unblock/{id}")
    public void unblockApp(@PathVariable Long id) {
        blockedAppService.unblockApp(id);
    }

    @GetMapping("/user/{userId}")
    public List<BlockedApp> getBlockedApps(@PathVariable Long userId) {
        return blockedAppService.getBlockedAppsForUser(userId);
    }
}
