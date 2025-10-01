package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

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

	budgetPeriodsTableSQL := `
	CREATE TABLE IF NOT EXISTS budget_periods (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE,
		start_date TEXT NOT NULL,
		end_date TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'Open', -- 'Open', 'Closed', 'Archived'
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT DEFAULT CURRENT_TIMESTAMP
	);`

	budgetAllocationsTableSQL := `
	CREATE TABLE IF NOT EXISTS budget_allocations (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		budget_period_id INTEGER NOT NULL,
		category_id INTEGER NOT NULL,
		allocated_amount REAL NOT NULL DEFAULT 0,
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (budget_period_id) REFERENCES budget_periods(id) ON DELETE CASCADE,
		FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
		UNIQUE (budget_period_id, category_id) -- Ensure a category is allocated only once per period
	);`

	// Envelopes table for envelope budgeting
	envelopesTableSQL := `
	CREATE TABLE IF NOT EXISTS envelopes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		category_id INTEGER NOT NULL,
		budgeted_amount REAL NOT NULL DEFAULT 0,
		budget_period_id INTEGER NOT NULL,
		status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'archived'
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
		FOREIGN KEY (budget_period_id) REFERENCES budget_periods(id) ON DELETE CASCADE
	);`

	// Create trigger for updating timestamps
	triggerEnvelopesSQL := `
	CREATE TRIGGER IF NOT EXISTS update_envelopes_updated_at
	AFTER UPDATE ON envelopes
	FOR EACH ROW
	BEGIN
		UPDATE envelopes SET updated_at = datetime('now') WHERE id = NEW.id;
	END;`

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
	triggerBudgetPeriodsSQL := `
	CREATE TRIGGER IF NOT EXISTS update_budget_periods_updated_at
	AFTER UPDATE ON budget_periods
	FOR EACH ROW
	BEGIN
		UPDATE budget_periods SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
	END;`
	triggerBudgetAllocationsSQL := `
	CREATE TRIGGER IF NOT EXISTS update_budget_allocations_updated_at
	AFTER UPDATE ON budget_allocations
	FOR EACH ROW
	BEGIN
		UPDATE budget_allocations SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
	END;`

	// Combine all SQL statements to execute
	statements := []string{
		accountsTableSQL,
		categoriesTableSQL,
		transactionsTableSQL,
		budgetPeriodsTableSQL,
		budgetAllocationsTableSQL,
		envelopesTableSQL,
		triggerAccountsSQL,
		triggerCategoriesSQL,
		triggerTransactionsSQL,
		triggerBudgetPeriodsSQL,
		triggerBudgetAllocationsSQL,
		triggerEnvelopesSQL,
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
	rows, err := db.Query("SELECT id, name, type, initial_balance, current_balance FROM accounts ORDER BY id ASC")
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

// AddCategory inserts a new category into the database.
func AddCategory(category models.Category) (models.Category, error) {
	db := GetDB()
	// Handle nullable ParentCategoryID
	var parentID sql.NullInt64
	if category.ParentCategoryID != nil {
		parentID = sql.NullInt64{Int64: *category.ParentCategoryID, Valid: true}
	} else {
		parentID = sql.NullInt64{Valid: false}
	}

	stmt, err := db.Prepare("INSERT INTO categories(name, type, parent_category_id) VALUES(?, ?, ?)")
	if err != nil {
		log.Printf("Error preparing add category statement: %v", err)
		return models.Category{}, err
	}
	defer stmt.Close()

	res, err := stmt.Exec(category.Name, category.Type, parentID)
	if err != nil {
		log.Printf("Error executing add category statement: %v", err)
		// Consider checking for unique constraint violation here if needed
		return models.Category{}, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		log.Printf("Error getting last insert ID for category: %v", err)
		return models.Category{}, err
	}
	category.ID = id
	log.Printf("Category added successfully with ID: %d", id)
	return category, nil
}

// GetCategories retrieves all categories from the database.
func GetCategories() ([]models.Category, error) {
	db := GetDB()
	// Query includes parent_category_id which can be NULL
	rows, err := db.Query("SELECT id, name, type, parent_category_id FROM categories ORDER BY id ASC")
	if err != nil {
		log.Printf("Error querying categories: %v", err)
		return nil, err
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var cat models.Category
		var parentID sql.NullInt64 // Use sql.NullInt64 for nullable parent_category_id

		// Note: We are not scanning created_at/updated_at yet
		if err := rows.Scan(&cat.ID, &cat.Name, &cat.Type, &parentID); err != nil {
			log.Printf("Error scanning category row: %v", err)
			return nil, err
		}

		// Assign parent ID only if it's valid (not NULL in the database)
		if parentID.Valid {
			cat.ParentCategoryID = &parentID.Int64
		} else {
			cat.ParentCategoryID = nil
		}

		categories = append(categories, cat)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error after iterating category rows: %v", err)
		return nil, err
	}

	log.Printf("Retrieved %d categories", len(categories))
	return categories, nil
}

// // TODO: Add functions for UpdateCategory, DeleteCategory, GetCategoryByID later

// AddTransaction inserts a new transaction and updates the corresponding account balance.
// It uses a database transaction to ensure atomicity.
func AddTransaction(transaction models.Transaction) (models.Transaction, error) {
	db := GetDB()
	tx, err := db.Begin() // Start transaction
	if err != nil {
		log.Printf("Error starting transaction for AddTransaction: %v", err)
		return models.Transaction{}, err
	}
	// Defer rollback in case of errors - it's a no-op if Commit() succeeds
	defer tx.Rollback()

	// 1. Insert the transaction
	stmtInsert, err := tx.Prepare(`
		INSERT INTO transactions(date, amount, type, description, category_id, account_id, notes, status)
		VALUES(?, ?, ?, ?, ?, ?, ?, ?) `)
	if err != nil {
		log.Printf("Error preparing insert transaction statement: %v", err)
		return models.Transaction{}, err
	}
	defer stmtInsert.Close() // Close even though it's within a transaction context for good practice

	// Format time for SQLite (YYYY-MM-DD HH:MM:SS)
	dateStr := transaction.Date.UTC().Format("2006-01-02 15:04:05")

	res, err := stmtInsert.Exec(
		dateStr,
		transaction.Amount,
		transaction.Type,
		transaction.Description,
		transaction.CategoryID,
		transaction.AccountID,
		transaction.Notes,
		transaction.Status,
	)
	if err != nil {
		log.Printf("Error executing insert transaction statement: %v", err)
		return models.Transaction{}, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		log.Printf("Error getting last insert ID for transaction: %v", err)
		return models.Transaction{}, err
	}
	transaction.ID = id

	// 2. Update the account balance
	stmtUpdate, err := tx.Prepare("UPDATE accounts SET current_balance = current_balance + ? WHERE id = ?")
	if err != nil {
		log.Printf("Error preparing update account balance statement: %v", err)
		return models.Transaction{}, err
	}
	defer stmtUpdate.Close()

	// Amount is added directly (it's negative for expenses, positive for income)
	_, err = stmtUpdate.Exec(transaction.Amount, transaction.AccountID)
	if err != nil {
		log.Printf("Error executing update account balance statement: %v", err)
		return models.Transaction{}, err
	}

	// 3. Commit the transaction
	if err = tx.Commit(); err != nil {
		log.Printf("Error committing transaction for AddTransaction: %v", err)
		return models.Transaction{}, err
	}

	log.Printf("Transaction added successfully with ID: %d and account %d balance updated.", transaction.ID, transaction.AccountID)
	return transaction, nil
}

// GetTransactions retrieves all transactions, ordered by date descending.
func GetTransactions() ([]models.Transaction, error) {
	db := GetDB()
	// Select transactions, ordering by date descending for typical display
	rows, err := db.Query(`
		SELECT id, date, amount, type, description, category_id, account_id, notes, status
		FROM transactions
		ORDER BY date DESC, id DESC`) // Order by ID as secondary sort for same-day transactions
	if err != nil {
		log.Printf("Error querying transactions: %v", err)
		return nil, err
	}
	defer rows.Close()

	var transactions []models.Transaction
	for rows.Next() {
		var t models.Transaction
		var dateStr string // Read date as string first

		// Note: We are not scanning created_at/updated_at yet
		err := rows.Scan(
			&t.ID,
			&dateStr, // Scan into string
			&t.Amount,
			&t.Type,
			&t.Description, // Need to handle potential NULL description if schema allows
			&t.CategoryID,
			&t.AccountID,
			&t.Notes, // Need to handle potential NULL notes if schema allows
			&t.Status,
		)
		if err != nil {
			log.Printf("Error scanning transaction row: %v", err)
			return nil, err
		}

		// Parse the date string (assuming UTC, adjust if using local time)
		// SQLite stores dates typically as TEXT in "YYYY-MM-DD HH:MM:SS" format
		parsedTime, timeErr := time.Parse("2006-01-02 15:04:05", dateStr)
		if timeErr != nil {
			log.Printf("Error parsing date string '%s' for transaction ID %d: %v", dateStr, t.ID, timeErr)
			// Decide how to handle parse errors - skip transaction? return error? For now, log and continue
			continue
		}
		t.Date = parsedTime

		transactions = append(transactions, t)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error after iterating transaction rows: %v", err)
		return nil, err
	}

	log.Printf("Retrieved %d transactions", len(transactions))
	return transactions, nil
}

// // TODO: Add functions for UpdateTransaction, DeleteTransaction, GetTransactionByID later
// // Note: Deleting/Updating transactions will also require updating account balance in reverse/differentially.

// AddBudgetPeriod inserts a new budget period into the database.
func AddBudgetPeriod(period models.BudgetPeriod) (models.BudgetPeriod, error) {
	db := GetDB()
	// Format time for SQLite (YYYY-MM-DD HH:MM:SS)
	startDateStr := period.StartDate.UTC().Format("2006-01-02 15:04:05")
	endDateStr := period.EndDate.UTC().Format("2006-01-02 15:04:05")

	stmt, err := db.Prepare("INSERT INTO budget_periods(name, start_date, end_date, status) VALUES(?, ?, ?, ?)")
	if err != nil {
		log.Printf("Error preparing add budget period statement: %v", err)
		return models.BudgetPeriod{}, err
	}
	defer stmt.Close()

	// Use period.Status if provided, otherwise default to "Open" (or let DB default handle it if schema is set up)
	// The schema currently defaults status to 'Open', so we can pass it directly.
	res, err := stmt.Exec(period.Name, startDateStr, endDateStr, period.Status)
	if err != nil {
		log.Printf("Error executing add budget period statement: %v", err)
		return models.BudgetPeriod{}, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		log.Printf("Error getting last insert ID for budget period: %v", err)
		return models.BudgetPeriod{}, err
	}
	period.ID = id
	// CreatedAt and UpdatedAt are set by the database, so we don't need to fetch them back here
	// unless they are immediately needed. For now, returning the ID is sufficient.
	log.Printf("Budget period added successfully with ID: %d", id)
	return period, nil
}

// GetBudgetPeriods retrieves all budget periods from the database, ordered by ID.
func GetBudgetPeriods() ([]models.BudgetPeriod, error) {
	db := GetDB()
	rows, err := db.Query("SELECT id, name, start_date, end_date, status FROM budget_periods ORDER BY id ASC")
	if err != nil {
		log.Printf("Error querying budget periods: %v", err)
		return nil, err
	}
	defer rows.Close()

	var periods []models.BudgetPeriod
	for rows.Next() {
		var p models.BudgetPeriod
		var startDateStr string
		var endDateStr string

		// Note: We are not scanning created_at/updated_at yet
		if err := rows.Scan(&p.ID, &p.Name, &startDateStr, &endDateStr, &p.Status); err != nil {
			log.Printf("Error scanning budget period row: %v", err)
			return nil, err
		}

		// Parse date strings
		// SQLite stores dates typically as TEXT in "YYYY-MM-DD HH:MM:SS" format
		parsedStartDate, timeErr := time.Parse("2006-01-02 15:04:05", startDateStr)
		if timeErr != nil {
			log.Printf("Error parsing start_date string '%s' for budget period ID %d: %v", startDateStr, p.ID, timeErr)
			// Continue with potentially zero-value time or return error
			return nil, timeErr // For now, return error to be safe
		}
		p.StartDate = parsedStartDate

		parsedEndDate, timeErr := time.Parse("2006-01-02 15:04:05", endDateStr)
		if timeErr != nil {
			log.Printf("Error parsing end_date string '%s' for budget period ID %d: %v", endDateStr, p.ID, timeErr)
			return nil, timeErr
		}
		p.EndDate = parsedEndDate

		periods = append(periods, p)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error after iterating budget period rows: %v", err)
		return nil, err
	}

	log.Printf("Retrieved %d budget periods", len(periods))
	return periods, nil
}

// // TODO: Add functions for UpdateBudgetPeriod, DeleteBudgetPeriod, GetBudgetPeriodByID later

// CountBudgetAllocations returns the number of allocations for a budget period.
func CountBudgetAllocations(budgetPeriodID int64) (int, error) {
    db := GetDB()
    row := db.QueryRow("SELECT COUNT(1) FROM budget_allocations WHERE budget_period_id = ?", budgetPeriodID)
    var cnt int
    if err := row.Scan(&cnt); err != nil {
        log.Printf("Error counting budget allocations for period ID %d: %v", budgetPeriodID, err)
        return 0, err
    }
    return cnt, nil
}

// UpdateBudgetPeriodStatus updates the status of a budget period.
func UpdateBudgetPeriodStatus(budgetPeriodID int64, status string) error {
    db := GetDB()
    stmt, err := db.Prepare("UPDATE budget_periods SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    if err != nil {
        log.Printf("Error preparing update budget period status statement: %v", err)
        return err
    }
    defer stmt.Close()

    res, err := stmt.Exec(status, budgetPeriodID)
    if err != nil {
        log.Printf("Error executing update budget period status for ID %d: %v", budgetPeriodID, err)
        return err
    }
    if n, _ := res.RowsAffected(); n == 0 {
        log.Printf("No budget period found with ID %d to update status.", budgetPeriodID)
        // Not treating as hard error; caller may decide
    }
    return nil
}

// AddBudgetAllocation inserts a new budget allocation into the database.
func AddBudgetAllocation(alloc models.BudgetAllocation) (models.BudgetAllocation, error) {
	db := GetDB()
	stmt, err := db.Prepare("INSERT INTO budget_allocations(budget_period_id, category_id, allocated_amount) VALUES(?, ?, ?)")
	if err != nil {
		log.Printf("Error preparing add budget allocation statement: %v", err)
		return models.BudgetAllocation{}, err
	}
	defer stmt.Close()

	res, err := stmt.Exec(alloc.BudgetPeriodID, alloc.CategoryID, alloc.AllocatedAmount)
	if err != nil {
		log.Printf("Error executing add budget allocation statement: %v", err)
		return models.BudgetAllocation{}, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		log.Printf("Error getting last insert ID for budget allocation: %v", err)
		return models.BudgetAllocation{}, err
	}
	alloc.ID = id
	log.Printf("Budget allocation added successfully with ID: %d for period %d and category %d", id, alloc.BudgetPeriodID, alloc.CategoryID)
	return alloc, nil
}

// GetBudgetAllocationsByBudgetPeriodID retrieves all allocations for a specific budget period.
func GetBudgetAllocationsByBudgetPeriodID(budgetPeriodID int64) ([]models.BudgetAllocation, error) {
	db := GetDB()
	rows, err := db.Query("SELECT id, budget_period_id, category_id, allocated_amount FROM budget_allocations WHERE budget_period_id = ? ORDER BY category_id ASC", budgetPeriodID)
	if err != nil {
		log.Printf("Error querying budget allocations for period ID %d: %v", budgetPeriodID, err)
		return nil, err
	}
	defer rows.Close()

	var allocations []models.BudgetAllocation
	for rows.Next() {
		var alloc models.BudgetAllocation
		// Note: We are not scanning created_at/updated_at yet
		if err := rows.Scan(&alloc.ID, &alloc.BudgetPeriodID, &alloc.CategoryID, &alloc.AllocatedAmount); err != nil {
			log.Printf("Error scanning budget allocation row: %v", err)
			return nil, err
		}
		allocations = append(allocations, alloc)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error after iterating budget allocation rows for period ID %d: %v", budgetPeriodID, err)
		return nil, err
	}

	log.Printf("Retrieved %d budget allocations for period ID %d", len(allocations), budgetPeriodID)
	return allocations, nil
}

// GetBudgetAllocation retrieves a specific budget allocation by budget period ID and category ID.
func GetBudgetAllocation(budgetPeriodID int64, categoryID int64) (models.BudgetAllocation, error) {
	db := GetDB()
	row := db.QueryRow("SELECT id, budget_period_id, category_id, allocated_amount FROM budget_allocations WHERE budget_period_id = ? AND category_id = ?", budgetPeriodID, categoryID)

	var alloc models.BudgetAllocation
	// Note: We are not scanning created_at/updated_at yet
	err := row.Scan(&alloc.ID, &alloc.BudgetPeriodID, &alloc.CategoryID, &alloc.AllocatedAmount)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No budget allocation found for period ID %d and category ID %d", budgetPeriodID, categoryID)
			return models.BudgetAllocation{}, err // Return specific error or custom error for not found
		}
		log.Printf("Error scanning budget allocation row for period ID %d and category ID %d: %v", budgetPeriodID, categoryID, err)
		return models.BudgetAllocation{}, err
	}

	log.Printf("Retrieved budget allocation ID %d for period ID %d and category ID %d", alloc.ID, budgetPeriodID, categoryID)
	return alloc, nil
}

// UpdateBudgetAllocation updates an existing budget allocation.
// It identifies the allocation by its ID.
func UpdateBudgetAllocation(alloc models.BudgetAllocation) (models.BudgetAllocation, error) {
	db := GetDB()
	stmt, err := db.Prepare("UPDATE budget_allocations SET allocated_amount = ? WHERE id = ?")
	if err != nil {
		log.Printf("Error preparing update budget allocation statement: %v", err)
		return models.BudgetAllocation{}, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(alloc.AllocatedAmount, alloc.ID)
	if err != nil {
		log.Printf("Error executing update budget allocation statement for ID %d: %v", alloc.ID, err)
		return models.BudgetAllocation{}, err
	}

	log.Printf("Budget allocation ID %d updated successfully.", alloc.ID)
	// We could re-fetch the allocation to get updated_at, but for now this is fine.
	return alloc, nil
}

// DeleteBudgetAllocation deletes a budget allocation by its ID.
func DeleteBudgetAllocation(id int64) error {
	db := GetDB()
	stmt, err := db.Prepare("DELETE FROM budget_allocations WHERE id = ?")
	if err != nil {
		log.Printf("Error preparing delete budget allocation statement: %v", err)
		return err
	}
	defer stmt.Close()

	res, err := stmt.Exec(id)
	if err != nil {
		log.Printf("Error executing delete budget allocation statement for ID %d: %v", id, err)
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		log.Printf("Error getting rows affected for delete budget allocation ID %d: %v", id, err)
		// Not returning error here as the delete might have still worked
	}
	if rowsAffected == 0 {
		log.Printf("No budget allocation found with ID %d to delete.", id)
		// Optionally return sql.ErrNoRows or a custom error
	}

	log.Printf("Budget allocation ID %d deleted successfully (or did not exist).", id)
	return nil
}

// // TODO: Consider an UpsertBudgetAllocation if needed due to UNIQUE constraint.

// ClearAllData deletes all data from all tables (for development/reset purposes).
// WARNING: This is destructive and cannot be undone.
func ClearAllData() error {
	db := GetDB()
	
	// Delete in order to respect foreign key constraints
	tables := []string{
		"budget_allocations",
		"transactions",
		"budget_periods",
		"categories",
		"accounts",
		"envelopes",
	}
	
	for _, table := range tables {
		stmt := fmt.Sprintf("DELETE FROM %s", table)
		_, err := db.Exec(stmt)
		if err != nil {
			log.Printf("Error clearing table %s: %v", table, err)
			return fmt.Errorf("failed to clear table %s: %w", table, err)
		}
		log.Printf("Cleared table: %s", table)
	}
	
	log.Println("All data cleared successfully")
	return nil
}
