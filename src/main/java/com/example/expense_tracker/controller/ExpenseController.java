package com.example.expense_tracker.controller;

import com.example.expense_tracker.model.Category;
import com.example.expense_tracker.model.Expense;
import com.example.expense_tracker.service.ExpenseManager;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/by-month")
    public List<Expense> getExpensesByMonth(@RequestParam(required = false) String category) {
        List<Expense> expenses = expenseManager.getExpensesByMonth(
                YearMonth.now().getYear(),
                YearMonth.now().getMonthValue()
        );

        if (category != null) {
            expenses = expenses.stream()
                    .filter(e -> e.getCategory().name().equals(category))
                    .collect(Collectors.toList());
        }

        return expenses;
    }
    @GetMapping("/expenses/category/{category}")
    public List<Expense> getExpensesByCategory(@PathVariable Category category) {
        return expenseManager.getExpenseBYCategory(category);
    }
    @GetMapping("/search")
    public List<Expense> searchExpenses(@RequestParam String name) {
        return expenseManager.searchByName(name);
    }

}
