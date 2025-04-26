package main

import (
	"context"
	"fmt"
	"log"
	"time"
	"vestramaximus/internal/database"
	"vestramaximus/internal/models"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
}

// shutdown is called when the app terminates.
func (a *App) shutdown(ctx context.Context) {
	log.Println("App shutting down...")
	database.CloseDB()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// AddAccount adds a new financial account.
// It receives the account data (without ID) from the frontend,
// calls the database function, and returns the created account (with ID).
func (a *App) AddAccount(name string, accountType string, initialBalance float64) (models.Account, error) {
	log.Printf("Received AddAccount call: Name=%s, Type=%s, Balance=%.2f", name, accountType, initialBalance)
	newAccount := models.Account{
		Name:           name,
		Type:           accountType,
		InitialBalance: initialBalance,
		CurrentBalance: initialBalance, // Current balance starts same as initial
	}
	createdAccount, err := database.AddAccount(newAccount)
	if err != nil {
		log.Printf("Error calling database.AddAccount: %v", err)
		// Return the error to the frontend
		return models.Account{}, fmt.Errorf("failed to add account: %w", err)
	}
	return createdAccount, nil
}

// GetAccounts retrieves all financial accounts.
// Called by the frontend to populate account lists.
func (a *App) GetAccounts() ([]models.Account, error) {
	log.Println("Received GetAccounts call")
	accounts, err := database.GetAccounts()
	if err != nil {
		log.Printf("Error calling database.GetAccounts: %v", err)
		// Return the error to the frontend
		return nil, fmt.Errorf("failed to retrieve accounts: %w", err)
	}
	return accounts, nil
}

// AddCategory adds a new income or expense category.
// parentCategoryID can be nil or 0 to indicate a top-level category.
func (a *App) AddCategory(name string, categoryType string, parentCategoryID *int64) (models.Category, error) {
	log.Printf("Received AddCategory call: Name=%s, Type=%s, ParentID=%v", name, categoryType, parentCategoryID)
	// Basic validation
	if categoryType != "Income" && categoryType != "Expense" {
		return models.Category{}, fmt.Errorf("invalid category type: %s", categoryType)
	}
	if name == "" {
		return models.Category{}, fmt.Errorf("category name cannot be empty")
	}

	newCategory := models.Category{
		Name:             name,
		Type:             categoryType,
		ParentCategoryID: parentCategoryID, // Pass the pointer directly
	}

	createdCategory, err := database.AddCategory(newCategory)
	if err != nil {
		log.Printf("Error calling database.AddCategory: %v", err)
		// Consider checking for specific DB errors like UNIQUE constraint violation
		return models.Category{}, fmt.Errorf("failed to add category: %w", err)
	}
	return createdCategory, nil
}

// GetCategories retrieves all categories.
func (a *App) GetCategories() ([]models.Category, error) {
	log.Println("Received GetCategories call")
	categories, err := database.GetCategories()
	if err != nil {
		log.Printf("Error calling database.GetCategories: %v", err)
		return nil, fmt.Errorf("failed to retrieve categories: %w", err)
	}
	return categories, nil
}

// AddTransaction adds a new transaction and updates the relevant account balance.
// dateString should be in a recognizable format, e.g., RFC3339 or "YYYY-MM-DD".
// We'll parse it and store consistently in the DB.
func (a *App) AddTransaction(
	dateString string,
	amount float64,
	transactionType string, // "Income" or "Expense"
	description string,
	categoryID int64,
	accountID int64,
	notes string,
	status string,
) (models.Transaction, error) {

	log.Printf("Received AddTransaction call: Date=%s, Amount=%.2f, Type=%s, Desc=%s, CatID=%d, AccID=%d, Status=%s",
		dateString, amount, transactionType, description, categoryID, accountID, status)

	// Validate Transaction Type
	if transactionType != "Income" && transactionType != "Expense" {
		return models.Transaction{}, fmt.Errorf("invalid transaction type: %s", transactionType)
	}
	// Ensure amount sign matches type (optional but good practice)
	if (transactionType == "Income" && amount < 0) || (transactionType == "Expense" && amount > 0) {
		// Or automatically flip the sign based on type? For now, enforce consistency.
		return models.Transaction{}, fmt.Errorf("amount sign does not match transaction type '%s'", transactionType)
	}
	if status == "" { // Default status if needed
		status = "Cleared"
	} else if status != "Cleared" && status != "Pending" {
		return models.Transaction{}, fmt.Errorf("invalid status: %s", status)
	}

	// Parse the date string. Wails often sends dates in RFC3339 format (like JS Date.toISOString())
	// Or it might be simpler like "YYYY-MM-DD". Let's try RFC3339 first.
	parsedDate, err := time.Parse(time.RFC3339, dateString)
	if err != nil {
		// Fallback: try parsing as YYYY-MM-DD if RFC3339 fails
		parsedDate, err = time.Parse("2006-01-02", dateString)
		if err != nil {
			log.Printf("Error parsing date string '%s': %v", dateString, err)
			return models.Transaction{}, fmt.Errorf("invalid date format: %s", dateString)
		}
	}

	newTransaction := models.Transaction{
		Date:        parsedDate,
		Amount:      amount, // Store amount as received (positive income, negative expense)
		Type:        transactionType,
		Description: description,
		CategoryID:  categoryID,
		AccountID:   accountID,
		Notes:       notes,
		Status:      status,
	}

	createdTransaction, err := database.AddTransaction(newTransaction)
	if err != nil {
		log.Printf("Error calling database.AddTransaction: %v", err)
		return models.Transaction{}, fmt.Errorf("failed to add transaction: %w", err)
	}
	return createdTransaction, nil
}

// GetTransactions retrieves all transactions.
func (a *App) GetTransactions() ([]models.Transaction, error) {
	log.Println("Received GetTransactions call")
	transactions, err := database.GetTransactions()
	if err != nil {
		log.Printf("Error calling database.GetTransactions: %v", err)
		return nil, fmt.Errorf("failed to retrieve transactions: %w", err)
	}
	// Note: The models.Transaction struct has Date as time.Time. Wails should handle
	// the automatic JSON marshalling to a string format (likely RFC3339) for the frontend.
	return transactions, nil
}
