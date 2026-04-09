package com.example.expense_tracker.controller;

import com.example.expense_tracker.model.Category;
import com.example.expense_tracker.model.Expense;
import com.example.expense_tracker.service.ExpenseManager;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    public Expense addExpense(@Valid @RequestBody Expense expense) {
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
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @Valid @RequestBody Expense expense) {
        return expenseManager.editExpense(id, expense.getAmount(), expense.getCategory(), expense.getDate(), expense.getTitle());
    }
    @GetMapping("/spent-this-month")
    public double getSpentThisMonth() {
        return expenseManager.totalSpentThisMonth();
    }
    @GetMapping("/avarage-per-day")
    public double getAveragePerDay() {
        return expenseManager.averagePerDay();
    }
    @GetMapping("/filter")
    public List<Expense> getFilterByDate(@RequestParam("start") LocalDate startDate, @RequestParam("end") LocalDate endDate) {
        return expenseManager.filterByDate(startDate, endDate);
    }
    @GetMapping("most-expensive-category")
    public Category  getMostExpensiveCategory() {
        return expenseManager.getMostExpenseCategory();
    }
    @GetMapping("sort-by-ammount")
    public List<Expense> sortByAmountDesc() {
        return expenseManager.filteredByAmount();
    }
}
