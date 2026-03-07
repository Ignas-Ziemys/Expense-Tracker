package com.example.expense_tracker.service;

import org.springframework.stereotype.Service;
import com.example.expense_tracker.util.FileHandler;
import com.example.expense_tracker.model.Category;
import com.example.expense_tracker.model.Expense;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseManager {
    private List<Expense> expenseList = new ArrayList<>();
    private FileHandler fileHandler;
    private long nextId = 1;

    public ExpenseManager(FileHandler fileHandler) {
        this.fileHandler = fileHandler;
        List<Expense> loaded = fileHandler.readExpenses();
        this.expenseList = loaded != null ? loaded : new ArrayList<>();

        for (Expense e : expenseList) {
            nextId = Math.max(nextId, e.getId() + 1);
        }
    }
    public Expense addExpense(Expense expense) {
        expense.setId(nextId++);
        expenseList.add(expense);
        fileHandler.saveExpenses(expenseList);
        return expense;
    }
    public boolean removeExpense(Long id) {
        boolean result = false;
        for (Expense expense : expenseList) {
            if (expense.getId() == id) {
                expenseList.remove(expense);
                result = true;
            }
        }
        if (result) {
            fileHandler.saveExpenses(expenseList);
        }
        return result;
    }
    public boolean updateExpense(int id, double amount, Category category, String description) {
        boolean result = false;
        for (Expense expense : expenseList) {
            if (expense.getId() == id) {
                expense.setId(id);
                expense.setAmount(amount);
                expense.setCategory(category);
                expense.setTitle(description);
                result = true;
            }
        }
        return result;
    }
    public List<Expense> getAllExpenses() {
        List<Expense> returnList = new ArrayList<>();
        for (Expense expense : expenseList) {
            returnList.add(expense);
        }
        return returnList;
    }
    public List<Expense> getExpenseBYCategory(Category category) {
        List<Expense> returnList = new ArrayList<>();
        for (Expense expense : expenseList) {
            if (expense.getCategory() == category) {
                returnList.add(expense);
            }
        }
        return returnList;
    }
    public List<Expense> getExpensesByMonth(YearMonth month) {
        List<Expense> returnList = new ArrayList<>();
        for (Expense expense : expenseList) {
            if (YearMonth.from(expense.getDate()).equals(month)) {
                returnList.add(expense);
            }
        }
        return returnList;
    }
    public List<Expense> getExpensesByMonth(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        return getExpensesByMonth(ym);
    }
    public Map<Category, Double> summary(YearMonth month) {
        Map<Category, Double> returnMap = new HashMap<>();
        for (Expense expense : expenseList) {
            if (YearMonth.from(expense.getDate()).equals(month))
            {
                returnMap.put(expense.getCategory(),  returnMap.getOrDefault(expense.getCategory(), 0.0) + expense.getAmount());
            }
        }
        return returnMap;
    }
}
