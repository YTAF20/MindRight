package com.mindright.service;

import com.mindright.model.Goal;
import com.mindright.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    public List<Goal> getUserGoals(Long userId) {
        return goalRepository.findByUserId(userId);
    }

    public Goal setGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public void deleteGoal(Long goalId) {
        goalRepository.deleteById(goalId);
    }
}
