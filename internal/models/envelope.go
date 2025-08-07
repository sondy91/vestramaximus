package models

import (
	"fmt"
	"time"
)

// Envelope represents an envelope in the envelope budgeting system.
// It tracks a budget allocation for a specific category within a budget period.
type Envelope struct {
	ID             int64         `json:"id"`
	Name           string        `json:"name"`
	Category       *Category     `json:"category"`
	BudgetedAmount float64       `json:"budgetedAmount"`
	Period         *BudgetPeriod `json:"period"`
	Status         string        `json:"status"` // "active", "paused", "archived"
	CreatedAt      time.Time     `json:"createdAt"`
	UpdatedAt      time.Time     `json:"updatedAt"`

	// transactions will hold all transactions for this envelope
	transactions []*Transaction `json:"-"`
}

// NewEnvelope creates a new envelope with the given parameters
func NewEnvelope(name string, category *Category, budgetedAmount float64, period *BudgetPeriod) *Envelope {
	now := time.Now()
	return &Envelope{
		Name:           name,
		Category:       category,
		BudgetedAmount: budgetedAmount,
		Period:         period,
		Status:         "active",
		CreatedAt:      now,
		UpdatedAt:      now,
		transactions:    make([]*Transaction, 0),
	}
}

// AddTransaction adds a transaction to this envelope
func (e *Envelope) AddTransaction(tx *Transaction) error {
	if e.Status == "archived" {
		return fmt.Errorf("cannot add transaction to archived envelope")
	}
	if e.Status == "paused" {
		return fmt.Errorf("cannot add transaction to paused envelope")
	}

	e.transactions = append(e.transactions, tx)
	e.UpdatedAt = time.Now()
	return nil
}

// Spent calculates the total amount spent from this envelope
func (e *Envelope) Spent() float64 {
	total := 0.0
	for _, tx := range e.transactions {
		if tx.Amount < 0 { // Only count expenses (negative amounts)
			total += -tx.Amount // Convert to positive for reporting
		}
	}
	return total
}

// Remaining calculates the remaining budget in this envelope
func (e *Envelope) Remaining() float64 {
	return e.BudgetedAmount - e.Spent()
}

// Pause marks the envelope as paused
func (e *Envelope) Pause() error {
	if e.Status == "archived" {
		return fmt.Errorf("cannot pause an archived envelope")
	}
	e.Status = "paused"
	e.UpdatedAt = time.Now()
	return nil
}

// Resume marks the envelope as active
func (e *Envelope) Resume() error {
	if e.Status == "archived" {
		return fmt.Errorf("cannot resume an archived envelope")
	}
	e.Status = "active"
	e.UpdatedAt = time.Now()
	return nil
}

// Archive marks the envelope as archived
func (e *Envelope) Archive() error {
	e.Status = "archived"
	e.UpdatedAt = time.Now()
	return nil
}
