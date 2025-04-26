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
