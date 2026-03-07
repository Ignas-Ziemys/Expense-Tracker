package com.example.expense_tracker.model;

public enum Category {
    FOOD("Food"),
    TRAVEL("Travel"),
    RENT("Rent"),
    SHOPPING("Shopping"),
    UTILITIES("Utilities"),
    ENTERTAINMENT("Entertainment"),
    OTHER("Other");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
