package com.example.expense_tracker.repository;

import com.example.expense_tracker.model.Category;
import com.example.expense_tracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserEmail(String email);
    List<Expense> findByUserEmailOrderByDateDesc(String email);
    List<Expense> findByUserEmailAndTitleContainingIgnoreCase(String email, String title);
    @Query("SELECT e FROM Expense e WHERE e.user.email = :email AND YEAR(e.date) = :year AND MONTH(e.date) = :month")
    List<Expense> findByUserAndYearAndMonth(@Param("email") String email, @Param("year") int year, @Param("month") int month);
    List<Expense> findByUserEmailAndCategory(String email, Category category);
    List<Expense> findByUserEmailOrderByAmountDesc(String email);
    List<Expense> findByUserEmailAndDateBetween(String email, LocalDate startDate, LocalDate endDate);
    Optional<Expense> findByIdAndUserEmail(Long id, String email);
}
