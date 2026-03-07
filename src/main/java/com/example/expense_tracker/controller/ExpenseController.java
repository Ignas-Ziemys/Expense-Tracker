package com.example.expense_tracker.controller;

import com.example.expense_tracker.model.Expense;
import com.example.expense_tracker.service.ExpenseManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/expenses")
public class ExpenseController {
    private final ExpenseManager expenseManager;

    public ExpenseController(ExpenseManager expenseManager) {
        this.expenseManager = expenseManager;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseManager.getAllExpenses();
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        System.out.println("Received expense: " + expense.getTitle());
        System.out.println(expense);
        return expenseManager.addExpense(expense);
    }
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable long id) {
        expenseManager.removeExpense(id);
    }
}
