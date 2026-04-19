package com.example.expense_tracker.controller;

import com.example.expense_tracker.service.ExpenseManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/budget")
public class BudgetController {
    @Autowired
    private ExpenseManager expenseManager;

    private String getCurrentUserEmail(Authentication authentication)
    {
        return authentication.getName();
    }

    @PostMapping("/{limit}")
    public void updateBudget(Authentication authentication, @PathVariable double limit)
    {
        expenseManager.updateBudget(limit, getCurrentUserEmail(authentication));
    }

    @GetMapping("/info")
    public Map<String, Object> getBudgetInfo(Authentication authentication)
    {
        Map<String,Object> map = new HashMap<>();
        map.put("limit", expenseManager.getBudget(getCurrentUserEmail(authentication)));
        map.put("isOver", expenseManager.isOverBudget(getCurrentUserEmail(authentication)));
        return map;
    }
}
