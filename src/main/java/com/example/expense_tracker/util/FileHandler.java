package com.example.expense_tracker.util;

import com.example.expense_tracker.model.Category;
import com.example.expense_tracker.model.Expense;
import org.springframework.stereotype.Component;

import java.io.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class FileHandler {
    private static final String FILE_NAME = "expenses.csv";

    public void saveExpenses(List<Expense> expenses) {
        try (FileWriter writer = new FileWriter(FILE_NAME)) {

            writer.write("id,amount,category,date,title\n");

            for (Expense e : expenses) {
                writer.write(
                        e.getId() + "," +
                                e.getAmount() + "," +
                                e.getCategory().name() + "," +
                                e.getDate() + "," +
                                e.getTitle() + "\n"
                );
            }

        } catch (IOException e) {
            throw new RuntimeException("Error saving expenses", e);
        }
    }
    public List<Expense> readExpenses() {
        List<Expense> expenses = new ArrayList<>();

        File file = new File(FILE_NAME);
        if (!file.exists()) {
            return expenses; // first run, no file yet
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {

            String line;
            reader.readLine(); // skip header

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");

                long id = Long.parseLong(parts[0]);
                double amount = Double.parseDouble(parts[1]);
                Category category = Category.valueOf(parts[2]);
                LocalDate date = LocalDate.parse(parts[3]);
                String note = parts.length > 4 ? parts[4] : "";

                expenses.add(new Expense(id, amount, category, date, note));
            }

        } catch (IOException e) {
            throw new RuntimeException("Error loading expenses", e);
        }

        return expenses;
    }
}
