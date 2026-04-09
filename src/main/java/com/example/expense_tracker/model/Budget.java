package com.example.expense_tracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double monthlyLimit;

    public Budget(Long id, double monthlyLimit) {
        this.id = id;
        this.monthlyLimit = monthlyLimit;
    }
    public Budget() {

    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public  double getMonthlyLimit() {
        return monthlyLimit;
    }
    public void setMonthlyLimit(double monthlyLimit) {
        this.monthlyLimit = monthlyLimit;
    }
}
