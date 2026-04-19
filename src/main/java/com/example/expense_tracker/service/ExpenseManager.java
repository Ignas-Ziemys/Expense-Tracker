package com.example.expense_tracker.service;

import com.example.expense_tracker.model.Budget;
import com.example.expense_tracker.model.User;
import com.example.expense_tracker.repository.BudgetRepository;
import com.example.expense_tracker.repository.ExpenseRepository;
import com.example.expense_tracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.example.expense_tracker.model.Category;
import com.example.expense_tracker.model.Expense;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseManager {
    private List<Expense> expenseList = new ArrayList<>();
    private ExpenseRepository expenseRepository;
    private BudgetRepository budgetRepository;
    private UserRepository userRepository;

    public ExpenseManager(ExpenseRepository expenseRepository,  BudgetRepository budgetRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }
    private User getCurrentUser(String email)
    {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Expense addExpense(Expense expense, String email) {
        expense.setUser(getCurrentUser(email));
        return expenseRepository.save(expense);
    }

    public boolean removeExpense(Long id, String email) {
        if (expenseRepository.findByIdAndUserEmail(id, email).isPresent()) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Expense editExpense(Long id, double amount, Category category, LocalDate date, String title, String email) {
        return expenseRepository.findByIdAndUserEmail(id, email).map(expense -> {
            expense.setAmount(amount);
            expense.setCategory(category);
            expense.setDate(date);
            expense.setTitle(title);
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense with id " + id + " not found"));
    }

    public List<Expense> getAllExpenses(String email) {
        return expenseRepository.findByUserEmailOrderByDateDesc(email);
    }

    public List<Expense> getExpenseBYCategory(Category category, String email) {
        return expenseRepository.findByUserEmailAndCategory(email, category);
    }

    public List<Expense> getExpensesByMonth(int year, int month, String email) {
        return expenseRepository.findByUserAndYearAndMonth(email, year, month);
    }

    public Map<Category, Double> summary(YearMonth month, String email) {
        List<Expense> expenses = expenseRepository.findByUserAndYearAndMonth(email, month.getYear(), month.getMonthValue());
        Map<Category, Double> map = new HashMap<>();
        for (Expense expense : expenses) {
            map.put(expense.getCategory(), map.getOrDefault(expense.getCategory(), 0.0) + expense.getAmount());
        }
        return map;
    }

    public Expense getExpenseByName(String expenseName, String email) {
        return expenseRepository.findByUserEmailAndTitleContainingIgnoreCase(email, expenseName).stream().findFirst().orElse(null);
    }

    public List<Expense> searchByName(String name, String email) {
        return expenseRepository.findByUserEmailAndTitleContainingIgnoreCase(email, name);
    }

    public double totalSpentThisMonth(String email) {
        List<Expense> expenses = expenseRepository.findByUserAndYearAndMonth(email, YearMonth.now().getYear(), YearMonth.now().getMonthValue());
        double total = 0.0;
        for  (Expense expense : expenses) {
            total += expense.getAmount();
        }
        return total;
    }

    public double averagePerDay(String email) {
        List<Expense> expenses = expenseRepository.findByUserAndYearAndMonth(email, YearMonth.now().getYear(), YearMonth.now().getMonthValue());
        double total = 0.0;
        for  (Expense expense : expenses) {
            total += expense.getAmount();
        }
        return Math.round(total / YearMonth.now().lengthOfMonth() * 100.0) / 100.0;
    }

    public List<Expense> filterByDate(LocalDate startDate,  LocalDate endDate, String email) {
        List<Expense> expenses = expenseRepository.findByUserEmail(email);
        List<Expense> filteredExpenses = new ArrayList<>();
        for (Expense expense : expenses) {
            if (!expense.getDate().isBefore(startDate) && !expense.getDate().isAfter(endDate)) {
                filteredExpenses.add(expense);
            }
        }
        return filteredExpenses;
    }

    public Category getMostExpenseCategory(String email) {
        Map<Category, Double> summary = summary(YearMonth.now(), email);
        Category mostExpenseCategory = null;
        double max = 0.0;
        for (Map.Entry<Category, Double> entry : summary.entrySet()) {
            if (entry.getValue() > max) {
                max = entry.getValue();
                mostExpenseCategory = entry.getKey();
            }
        }
        return mostExpenseCategory;
    }

    public List<Expense> filteredByAmount(String email) {
        return expenseRepository.findByUserEmailOrderByAmountDesc(email);
    }

    public void updateBudget(double limit, String email)
    {
        Budget budget = budgetRepository.findFirstByUserEmail(email).orElse(new Budget());
        budget.setUser(getCurrentUser(email));
        budget.setMonthlyLimit(limit);
        budgetRepository.save(budget);
    }

    public double getBudget(String email) {
        return budgetRepository.findFirstByUserEmail(email)
                .map(Budget::getMonthlyLimit)
                .orElse(0.0);
    }

    public boolean isOverBudget(String email)
    {
        double budget = getBudget(email);
        double totalSpent = totalSpentThisMonth(email);
        if (budget <= 0) return false;
        return totalSpent > budget;
    }
}
