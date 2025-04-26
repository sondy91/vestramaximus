package main

import (
	"context"
	"fmt"
	"log"
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
