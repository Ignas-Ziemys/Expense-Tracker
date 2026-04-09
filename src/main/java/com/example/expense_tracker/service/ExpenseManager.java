package com.example.expense_tracker.service;

import com.example.expense_tracker.model.Budget;
import com.example.expense_tracker.repository.BudgetRepository;
import com.example.expense_tracker.repository.ExpenseRepository;
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

    public ExpenseManager(ExpenseRepository expenseRepository,  BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }
    public boolean removeExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public Expense editExpense(Long id, double amount, Category category, LocalDate date, String title) {
        return expenseRepository.findById(id).map(expense -> {
            expense.setAmount(amount);
            expense.setCategory(category);
            expense.setDate(date);
            expense.setTitle(title);
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense with id " + id + " not found"));
    }
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
    public List<Expense> getExpenseBYCategory(Category category) {
        return expenseRepository.findByCategory(category);
    }
    public List<Expense> getExpensesByMonth(int year, int month) {
        return expenseRepository.findByYearAndMonth(year, month);
    }
    public Map<Category, Double> summary(YearMonth month) {
        List<Expense> expenses = expenseRepository.findByYearAndMonth(month.getYear(), month.getMonthValue());
        Map<Category, Double> map = new HashMap<>();
        for (Expense expense : expenses) {
            map.put(expense.getCategory(), map.getOrDefault(expense.getCategory(), 0.0) + expense.getAmount());
        }
        return map;
    }
    public Expense getExpenseByName(String expenseName) {
        return expenseRepository.findByTitleContainingIgnoreCase(expenseName).stream().findFirst().orElse(null);
    }
    public List<Expense> searchByName(String name) {
        return expenseRepository.findByTitleContainingIgnoreCase(name);
    }
    public double totalSpentThisMonth() {
        List<Expense> expenses = expenseRepository.findByYearAndMonth(YearMonth.now().getYear(), YearMonth.now().getMonthValue());
        double total = 0.0;
        for  (Expense expense : expenses) {
            total += expense.getAmount();
        }
        return total;
    }
    public double averagePerDay() {
        List<Expense> expenses = expenseRepository.findByYearAndMonth(YearMonth.now().getYear(), YearMonth.now().getMonthValue());
        double total = 0.0;
        for  (Expense expense : expenses) {
            total += expense.getAmount();
        }
        return Math.round(total / YearMonth.now().lengthOfMonth() * 100.0) / 100.0;
    }
    public List<Expense> filterByDate(LocalDate startDate,  LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findAll();
        List<Expense> filteredExpenses = new ArrayList<>();
        for (Expense expense : expenses) {
            if (!expense.getDate().isBefore(startDate) && !expense.getDate().isAfter(endDate)) {
                filteredExpenses.add(expense);
            }
        }
        return filteredExpenses;
    }
    public Category getMostExpenseCategory() {
        Map<Category, Double> summary = summary(YearMonth.now());
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
    public List<Expense> filteredByAmount() {
        return expenseRepository.findAllByOrderByAmountDesc();
    }
    public void updateBudget(double limit)
    {
        Budget budget = budgetRepository.findById(1L).orElse(new Budget());
        budget.setMonthlyLimit(limit);
        budgetRepository.save(budget);
    }
    public double getBudget() {
        return budgetRepository.findById(1L)
                .map(Budget::getMonthlyLimit)
                .orElse(0.0);
    }
    public boolean isOverBudget()
    {
        double budget = getBudget();
        double totalSpent = totalSpentThisMonth();
        if (budget <= 0) return false;
        return totalSpent > budget;
    }
}
