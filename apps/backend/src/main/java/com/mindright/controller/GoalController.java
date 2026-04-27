package com.mindright.controller;

import com.mindright.model.Goal;
import com.mindright.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping("/user/{userId}")
    public List<Goal> getUserGoals(@PathVariable Long userId) {
        return goalService.getUserGoals(userId);
    }

    @PostMapping("/set")
    public Goal setGoal(@RequestBody Goal goal) {
        return goalService.setGoal(goal);
    }

    @DeleteMapping("/delete/{goalId}")
    public void deleteGoal(@PathVariable Long goalId) {
        goalService.deleteGoal(goalId);
    }
}
