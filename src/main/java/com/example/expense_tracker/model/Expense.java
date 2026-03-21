package com.example.expense_tracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private double amount;
    private LocalDate date;
    private String title;
    private Category category;

    public Expense(long id, double amount, Category category, LocalDate date, String title) {
        this.id = id;
        this.amount = amount;
        this.date = date;
        this.title = title;
        this.category = category;
    }
    public Expense()
    {

    }
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public double getAmount() {
        return amount;
    }
    public void setAmount(double ammount) {
        this.amount = ammount;
    }
    public Category getCategory() {
        return category;
    }
    public void setCategory(Category category) {
        this.category = category;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String note) {
        this.title = note;
    }
}
