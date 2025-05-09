package models

import "time"

// Account represents a financial account (e.g., Checking, Savings, Credit Card).
type Account struct {
	ID             int64   `json:"id"`
	Name           string  `json:"name"`
	Type           string  `json:"type"` // e.g., "Checking", "Savings", "Credit Card", "Loan", "Cash"
	InitialBalance float64 `json:"initialBalance"`
	CurrentBalance float64 `json:"currentBalance"`
	// Consider adding CreatedAt, UpdatedAt if needed later
}

// Category represents an income or expense category.
type Category struct {
	ID               int64  `json:"id"`
	Name             string `json:"name"`
	Type             string `json:"type"`             // "Income" or "Expense"
	ParentCategoryID *int64 `json:"parentCategoryId"` // Use pointer for nullable foreign key
	// Consider adding CreatedAt, UpdatedAt if needed later
}

// Transaction represents a single financial movement.
type Transaction struct {
	ID          int64     `json:"id"`
	Date        time.Time `json:"date"`
	Amount      float64   `json:"amount"` // Positive for income, negative for expense
	Type        string    `json:"type"`   // "Income" or "Expense" - Can be derived from Amount sign, but explicit might be clearer
	Description string    `json:"description"`
	CategoryID  int64     `json:"categoryId"`
	AccountID   int64     `json:"accountId"`
	Notes       string    `json:"notes"`
	Status      string    `json:"status"` // e.g., "Cleared", "Pending"
	// Consider adding CreatedAt, UpdatedAt if needed later
}

// BudgetPeriod represents a specific instance of a budget (e.g., "June 2025 Budget").
type BudgetPeriod struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"` // e.g., "July 2024 Budget", "Q3 2024"
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
	Status    string    `json:"status"` // e.g., "Open", "Closed", "Archived"
	// CreatedAt, UpdatedAt can be added if needed
}

// BudgetAllocation links a BudgetPeriod to a BudgetCategory with an allocated amount.
type BudgetAllocation struct {
	ID              int64   `json:"id"`
	BudgetPeriodID  int64   `json:"budgetPeriodId"`
	CategoryID      int64   `json:"categoryId"`
	AllocatedAmount float64 `json:"allocatedAmount"`
	// Optional: CarryoverFlag bool `json:"carryoverFlag"` (for future enhancement)
	// CreatedAt, UpdatedAt can be added if needed
}
