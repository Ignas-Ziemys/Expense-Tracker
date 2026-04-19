package com.example.expense_tracker.controller;

import com.example.expense_tracker.model.Category;
import com.example.expense_tracker.model.Expense;
import com.example.expense_tracker.service.ExpenseManager;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
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

    private String getCurrentUserEmail(Authentication authentication)
    {
        return authentication.getName();
    }

    @GetMapping
    public List<Expense> getAllExpenses(Authentication authentication) {
        return expenseManager.getAllExpenses(getCurrentUserEmail(authentication));
    }

    @PostMapping
    public Expense addExpense(Authentication authentication, @Valid @RequestBody Expense expense) {
        System.out.println("Received expense: " + expense.getTitle());
        System.out.println(expense);
        return expenseManager.addExpense(expense, getCurrentUserEmail(authentication));
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(Authentication authentication, @PathVariable long id) {
        expenseManager.removeExpense(id, getCurrentUserEmail(authentication));
    }

    @GetMapping("/by-month")
    public List<Expense> getExpensesByMonth(Authentication authentication, @RequestParam(required = false) String category) {
        List<Expense> expenses = expenseManager.getExpensesByMonth(
                YearMonth.now().getYear(),
                YearMonth.now().getMonthValue(),
                getCurrentUserEmail(authentication)
        );

        if (category != null) {
            expenses = expenses.stream()
                    .filter(e -> e.getCategory().name().equals(category))
                    .collect(Collectors.toList());
        }

        return expenses;
    }

    @GetMapping("/expenses/category/{category}")
    public List<Expense> getExpensesByCategory(Authentication authentication, @PathVariable Category category) {
        return expenseManager.getExpenseBYCategory(category, getCurrentUserEmail(authentication));
    }

    @GetMapping("/search")
    public List<Expense> searchExpenses(Authentication authentication, @RequestParam String name) {
        return expenseManager.searchByName(name, getCurrentUserEmail(authentication));
    }

    @PutMapping("/{id}")
    public Expense updateExpense(Authentication authentication, @PathVariable Long id, @Valid @RequestBody Expense expense) {
        return expenseManager.editExpense(id, expense.getAmount(), expense.getCategory(), expense.getDate(), expense.getTitle(), getCurrentUserEmail(authentication));
    }

    @GetMapping("/spent-this-month")
    public double getSpentThisMonth(Authentication authentication) {
        return expenseManager.totalSpentThisMonth(getCurrentUserEmail(authentication));
    }

    @GetMapping("/avarage-per-day")
    public double getAveragePerDay(Authentication authentication) {
        return expenseManager.averagePerDay(getCurrentUserEmail(authentication));
    }

    @GetMapping("/filter")
    public List<Expense> getFilterByDate(Authentication authentication, @RequestParam("start") LocalDate startDate, @RequestParam("end") LocalDate endDate) {
        return expenseManager.filterByDate(startDate, endDate, getCurrentUserEmail(authentication));
    }

    @GetMapping("most-expensive-category")
    public Category  getMostExpensiveCategory(Authentication authentication) {
        return expenseManager.getMostExpenseCategory(getCurrentUserEmail(authentication));
    }

    @GetMapping("sort-by-ammount")
    public List<Expense> sortByAmountDesc(Authentication authentication) {
        return expenseManager.filteredByAmount(getCurrentUserEmail(authentication));
    }
}
