package com.example.expense_tracker.controller;

import com.example.expense_tracker.service.ExpenseManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/budget")
public class BudgetController {
    @Autowired
    private ExpenseManager expenseManager;

    @PostMapping("/{limit}")
    public void updateBudget(@PathVariable double limit)
    {
        expenseManager.updateBudget(limit);
    }
    @GetMapping("/info")
    public Map<String, Object> getBudgetInfo()
    {
        Map<String,Object> map = new HashMap<>();
        map.put("limit", expenseManager.getBudget());
        map.put("isOver", expenseManager.isOverBudget());
        return map;
    }
}
