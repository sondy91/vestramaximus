package database

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

	"vestramaximus/internal/models" // Add models import

	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

var db *sql.DB

const dbFileName = "vestramaximus.db"

// InitDB initializes the database connection and creates tables if they don't exist.
func InitDB() error {
	// Determine data directory (e.g., in user's config or app data folder)
	// For simplicity now, we'll place it next to the executable or in the current dir
	// A more robust solution would use os.UserConfigDir() or similar.
	dbPath := dbFileName // Place it in the current working directory for now

	// Check if the database file exists, create directory if needed (though not strictly needed for current path)
	dbDir := filepath.Dir(dbPath)
	if _, err := os.Stat(dbDir); os.IsNotExist(err) {
		if err := os.MkdirAll(dbDir, 0750); err != nil {
			log.Printf("Error creating database directory: %v", err)
			return err
		}
	}

	log.Printf("Initializing database at: %s", dbPath)
	var err error
	db, err = sql.Open("sqlite3", dbPath+"?_foreign_keys=on") // Enable foreign key constraints
	if err != nil {
		log.Printf("Error opening database: %v", err)
		return err
	}

	// Check the connection
	if err = db.Ping(); err != nil {
		log.Printf("Error pinging database: %v", err)
		return err
	}

	log.Println("Database connection established.")

	// Create tables
	return createTables()
}

// GetDB returns the database connection pool.
func GetDB() *sql.DB {
	if db == nil {
		// This shouldn't happen if InitDB is called first, but as a safeguard
		log.Fatal("Database not initialized. Call InitDB first.")
	}
	return db
}

// CloseDB closes the database connection.
func CloseDB() {
	if db != nil {
		err := db.Close()
		if err != nil {
			log.Printf("Error closing database: %v", err)
		}
		log.Println("Database connection closed.")
	}
}

// createTables creates the necessary database tables if they don't already exist.
func createTables() error {
	// Use TEXT for Date/Time as recommended by SQLite
	// Use REAL for floating-point numbers (currency)
	// Use INTEGER PRIMARY KEY AUTOINCREMENT for unique IDs

	accountsTableSQL := `
	CREATE TABLE IF NOT EXISTS accounts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		type TEXT NOT NULL,
		initial_balance REAL NOT NULL DEFAULT 0,
		current_balance REAL NOT NULL DEFAULT 0,
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT DEFAULT CURRENT_TIMESTAMP
	);`

	categoriesTableSQL := `
	CREATE TABLE IF NOT EXISTS categories (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE,
		type TEXT NOT NULL, -- 'Income' or 'Expense'
		parent_category_id INTEGER, -- Nullable
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE SET NULL -- Allow deleting parent category
	);`

	transactionsTableSQL := `
	CREATE TABLE IF NOT EXISTS transactions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		date TEXT NOT NULL,
		amount REAL NOT NULL,
		type TEXT NOT NULL, -- 'Income' or 'Expense'
		description TEXT,
		category_id INTEGER NOT NULL,
		account_id INTEGER NOT NULL,
		notes TEXT,
		status TEXT NOT NULL DEFAULT 'Cleared', -- 'Cleared' or 'Pending'
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (category_id) REFERENCES categories(id),
		FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE -- If account is deleted, delete its transactions
	);`

	// Trigger to update `updated_at` timestamp (Example for accounts table)
	// Similar triggers can be added for other tables if needed.
	triggerAccountsSQL := `
	CREATE TRIGGER IF NOT EXISTS update_accounts_updated_at
	AFTER UPDATE ON accounts
	FOR EACH ROW
	BEGIN
		UPDATE accounts SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
	END;`
	triggerCategoriesSQL := `
	CREATE TRIGGER IF NOT EXISTS update_categories_updated_at
	AFTER UPDATE ON categories
	FOR EACH ROW
	BEGIN
		UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
	END;`
	triggerTransactionsSQL := `
	CREATE TRIGGER IF NOT EXISTS update_transactions_updated_at
	AFTER UPDATE ON transactions
	FOR EACH ROW
	BEGIN
		UPDATE transactions SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
	END;`

	statements := []string{
		accountsTableSQL,
		categoriesTableSQL,
		transactionsTableSQL,
		triggerAccountsSQL,
		triggerCategoriesSQL,
		triggerTransactionsSQL,
	}

	tx, err := db.Begin()
	if err != nil {
		log.Printf("Error starting transaction for table creation: %v", err)
		return err
	}

	for _, stmt := range statements {
		_, err = tx.Exec(stmt)
		if err != nil {
			tx.Rollback() // Rollback if any statement fails
			log.Printf("Error executing statement: %v\nSQL: %s", err, stmt)
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("Error committing transaction for table creation: %v", err)
		return err
	}

	log.Println("Database tables checked/created successfully.")
	return nil
}

// AddAccount inserts a new account into the database.
func AddAccount(account models.Account) (models.Account, error) {
	db := GetDB()
	stmt, err := db.Prepare("INSERT INTO accounts(name, type, initial_balance, current_balance) VALUES(?, ?, ?, ?)")
	if err != nil {
		log.Printf("Error preparing add account statement: %v", err)
		return models.Account{}, err
	}
	defer stmt.Close()

	res, err := stmt.Exec(account.Name, account.Type, account.InitialBalance, account.CurrentBalance)
	if err != nil {
		log.Printf("Error executing add account statement: %v", err)
		return models.Account{}, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		log.Printf("Error getting last insert ID for account: %v", err)
		return models.Account{}, err
	}
	account.ID = id
	log.Printf("Account added successfully with ID: %d", id)
	return account, nil
}

// GetAccounts retrieves all accounts from the database.
func GetAccounts() ([]models.Account, error) {
	db := GetDB()
	rows, err := db.Query("SELECT id, name, type, initial_balance, current_balance FROM accounts ORDER BY name ASC")
	if err != nil {
		log.Printf("Error querying accounts: %v", err)
		return nil, err
	}
	defer rows.Close()

	var accounts []models.Account
	for rows.Next() {
		var acc models.Account
		// Note: We are not scanning created_at/updated_at yet
		if err := rows.Scan(&acc.ID, &acc.Name, &acc.Type, &acc.InitialBalance, &acc.CurrentBalance); err != nil {
			log.Printf("Error scanning account row: %v", err)
			return nil, err
		}
		accounts = append(accounts, acc)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error after iterating account rows: %v", err)
		return nil, err
	}

	log.Printf("Retrieved %d accounts", len(accounts))
	return accounts, nil
}

// // TODO: Add functions for UpdateAccount, DeleteAccount, GetAccountByID later
