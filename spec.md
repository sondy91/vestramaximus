# Personal Finance MVP Requirements

## 1. MVP Overview

- Goal: Replace spreadsheet-based personal finance tracking with a streamlined, privacy-focused local desktop application.
- Scope: The core functionality for the MVP is focused on comprehensive envelope-style budget creation with manual income and expense tracking. This includes defining budget periods, allocating funds to categories (envelopes), visually tracking spending against these allocations, and receiving alerts for budget thresholds. The MVP will also provide essential budget visualization and reporting.
- Deployment: Local-only for the initial release. This means all data is stored and processed exclusively on the user's device. There will be no cloud synchronization, direct bank integrations (via APIs), or external data sharing in the MVP.

## 2. User Personas

1. Individual Earner
    - Description: Someone managing their own finances, typically with one or two primary income sources (hourly or salaried).
    - Needs: Simple and quick manual transaction entry, clear tracking of spending against an envelope-style budget, timely alerts for budget thresholds, and an easy-to-understand snapshot of their current financial position relative to their budget. A step-by-step approach to starting a budget for new users.

## 3. User Stories

1. Income & Expense Management

    - As a user, I want to manually log individual income and expense transactions quickly and easily, assigning them to specific categories and optionally adding notes, so I can track every financial movement.
    - As a user, I want to record a one-off income or expense and see its immediate impact on my budget.

2. Budgeting

    - As a user, I want to set up budgets with different spending categories (e.g., Groceries, Utilities, Entertainment) for a defined period (e.g., monthly), allocating a specific amount to each.
    - As a user, I want to see at a glance how much of my budget I have spent in each category and how much is remaining, ideally with a visual indicator like a progress bar, to help me stay within my spending limits.
    - As a user, I want to receive alerts or notifications when my spending in a specific budget category is nearing or has exceeded the allocated amount, to help me enforce budget discipline in real-time.
    - As a user, I want to be able to roll over positive unspent amounts from a budget category to the next budget period (default of a month).
    - As a user, I want to set up budgets in a step-by-step process that is easy to create a budget for a time period, add categories, and transactions to a category.
    - As a user, I want to set a planned allocation amount for a budget category item.

3. Dashboard & Reporting

    - As a user, I want a dashboard that provides an at-a-glance summary of my current budget status and recent manual transactions.
    - As a user, I want to view visual reports (e.g., pie charts, bar graphs) that break down my spending by category over different time periods, so I can easily identify spending patterns and areas where I might save.
    - As a user, I want to see reports or charts illustrating my income vs. expenses over time and track trends in my financial habits to see if I am improving.
    - As a user, I want to generate and export custom reports (e.g., CSV) for specific date ranges, filtered by categories, for external analysis or record-keeping.

4. Data Management & Security

    - As a user, I want my sensitive financial data to be stored exclusively on my local device, encrypted at rest, to ensure my privacy and prevent unauthorized third-party access.
    - As a user, I want the option to set a local PIN or password to access the application, adding an extra layer of security for my data on the device.
    - As a user, I want to manually create a local backup of my financial records.
    - As a user, I want to be able to easily restore my financial data from a local backup file if needed.

## 4. Functional Requirements

### 4.1 Income & Expense Management

- Manual Transaction Entry:
    - Input fields for Date, Signed Amount, Description/Payee, Category, and optional Notes.
    - A positive amount is an income entry; a negative amount is an expense entry.
- Categorization System:
    - Allow users to create, edit, and delete custom expense and income categories.
    - Support creating subcategories within main categories for more granular tracking.
    - Provide a set of default budgeting categories for users to choose from during initial setup or at any time.

### 4.2 Budgeting

- Envelope Budgeting Core:
    - Enable the creation of budget periods (defaulting to monthly, with future extensibility for other custom dates).
    - BudgetAllocation stores only PlannedAmount (the envelope “ceiling”).
    - Actual inflows/outflows are recorded solely as Transaction rows tied to a category.
    - Remaining balance for a category is computed dynamically:
        - Remaining = PlannedAmount + Σ(Transactions.Amount). (since expenses are negative).
    - No roll‑over of negative balances; overspend stays in the current period.
- Budget Tracking Visualization:
    - Display each budget category with the allocated amount, the amount spent so far, and the remaining balance.
    - Provide a visual progress bar or similar indicator showing the proportion of the budget spent.
    - Highlight categories that are over budget.
- Budget Alerts:
    - Allow users to set custom thresholds (e.g., 80% spent) for specific budget categories to trigger notifications.
    - Alert the user when spending in a category exceeds the allocated budget.
- Budget Setup Workflow:
    - Provide a guided, step-by-step process for new users to create their first budget, including defining the budget period, adding categories, and understanding how to link transactions.

### 4.3 Dashboard & Reporting

- Main Dashboard View:
    - Display an at-a-glance summary of the current budget status, including overall budget progress and quick access to recent manual transactions.
- Detailed Reports:
    - Spending by Category Report: Tabular and graphical (pie chart) view of spending per category for a selected date range, with drill-down capability into individual transactions within a category.
    - Income Report: List and sum of income received over a selected date range, filterable by category.
    - Transaction History: Filterable and searchable list of all manual transactions.
- Trend Analysis:
    - Visualize spending patterns and income trends over selected periods to identify changes in financial habits.
    - Compare spending in categories across different budget periods.
- Custom Report Generation:
    - Allow users to define parameters (date range, categories) for a report.
    - Export the generated report data to CSV format.

## 5. Data Model (High-Level)

- User (Local Only): Primary configuration and settings for the single user.
    - Attributes: User ID (generated locally), User Name, PIN/Password (hashed/encrypted), Last Login Timestamp.
- BudgetCategory: Defines a spending or income category for budgeting.
    - Attributes: Category ID, Name, Type (Income, Expense), Parent Category ID (for subcategories, nullable), IsDefault (boolean, for pre-defined categories).
- BudgetPeriod: Represents a specific instance of a budget (e.g., "June 2025 Budget").
    - Attributes: Period ID, Name (e.g., "Monthly Budget - June 2025"), Start Date, End Date, Status (Open, Closed).
- BudgetAllocation: Links a BudgetPeriod to a BudgetCategory with allocated amounts.
    - Attributes: Allocation ID, BudgetPeriod ID, BudgetCategory ID, PlannedAmount (the target allocation).
- Transaction: Represents a single manual financial movement.
    - Attributes: Transaction ID, Date, Amount, Description/Payee, Category ID, Notes (optional).
- Backup: Record of local backups.
    - Attributes: Backup ID, Timestamp, FilePath, Status (Success/Fail).
- AuditLog (Local Only): Record of changes to key data entities.
    - Attributes: Log ID, Timestamp, UserAction (Create, Update), EntityType, EntityID, SummaryOfChange (textual description of the change).

## 6. UI/UX Requirements

- Intuitive Navigation: Clear and easy access to key sections: Dashboard, Budgets, Transactions, Reports, and Settings.
- Data Entry Workflow: Streamlined forms for adding manual transactions and setting up budget categories with minimal steps.
- Responsive Design: While desktop-first for MVP, the UI should be designed with a flexible layout approach that could potentially adapt to different window sizes.
- Interactive Data Visualization: Charts should be interactive, allowing users to hover over data points for details, click on segments (e.g., a slice in a pie chart) to filter related transactions, and adjust date ranges easily.
- Accessibility: Ensure sufficient color contrast in charts and throughout the interface. Consider keyboard navigation accessibility.
- Visual Budget Tracking: Use clear progress bars, color-coding (e.g., green for under budget, yellow for nearing limit, red for over budget), and numerical displays for budget remaining.
- Clear Feedback: Provide clear visual confirmation for successful actions (e.g., transaction saved) and informative error messages.

## 7. Non-Functional Requirements

- Deployment Environment: Desktop application for Windows, macOS, and Linux.
- Local-Only Data Storage: All application data (transactions, budgets, user profiles, etc.) must reside solely on the user's local storage device.
- Performance:
    - Key views (Dashboard, Current Budget Period) should load and display data within 1-2 seconds for a reasonable amount of manually entered transaction history (e.g., up to 50,000 transactions over a few years).
    - Manual transaction entry should be near instantaneous.
    - Report generation for a typical date range (e.g., 1 year) should complete within a few seconds.
- Security:
    - Encryption at Rest (optional):
        - When the user enables a PIN, the application derives an AES‑GCM key from that PIN using Argon2, and encrypts the SQLite DB file.
        - Without a PIN, data remain unencrypted on disk.
- Reliability:
    - Manual Backup/Restore: Provide a user-initiated option to create a manual backup file and to restore data from a previously created backup file, with clear warnings about data overwriting.
- Scalability (within MVP scope): The architecture should be able to handle a reasonable amount of local data (e.g., manually entered transactions for several years) without significant performance degradation.
- Data Integrity: Implement validation rules to ensure data consistency (e.g., validate that sign matches intent (negative = expense, positive = income)).

## 8. Error Handling & Audit

- Input Validation: Implement robust validation on user input fields (e.g., ensure numeric fields contain numbers, required fields are filled, dates are valid). Provide clear feedback to the user on validation errors.
- Data Consistency Checks: Implement checks to prevent logical inconsistencies relevant to the MVP (e.g., allocating a budget to a non-existent category, transactions linked to non-existent categories).
- Graceful Error Handling: The application should not crash on errors. Instead, it should log errors internally (locally) and potentially notify the user in a non-disruptive way if an action failed.
- Local Audit Trail: Maintain a local, immutable log of significant data changes (creation, modification, deletion of transactions, budget categories, budget periods, allocations). This trail is for debugging and data integrity verification, not a user-facing feature in the MVP.

## 9. Future Enhancements (Post-MVP)

- Multi-User / Household Management:
    - Ability to manage finances for multiple individuals within a household.
    - Shared budgeting capabilities with options for per-person or per-purpose tagging of transactions.
    - Consolidated views of household finances.
- Advanced Transaction Management:
    - Setting up Recurring Transactions with customizable frequencies.
    - Bulk Transaction Import from standard file formats (CSV, OFX, QIF).
    - Review screen for imported transactions to recategorize, merge, or edit.
    - Split Transactions: Allow a single transaction to be allocated across multiple budget categories.
- Account Management:
    - Creation and management of multiple distinct financial accounts (e.g., Checking, Savings, Credit Card, Loan, Cash).
    - Tracking initial and current balances for each account.
    - Calculating and displaying total balance across selected or all accounts.
    - Inter-Account Transfers: Explicitly support transactions representing money moving between different financial accounts.
- Financial Planning & Forecasting:
    - Forward-looking Cash Flow Forecasting based on current balance and scheduled income/expenses.
    - "What-if" scenarios to simulate the impact of hypothetical transactions or adjustments.
    - Savings Goals tracking (e.g., emergency fund, down payment) with progress monitoring.
    - Debt Payoff Goals tracking (e.g., specific loans or credit cards) and progress monitoring.
    - Detailed Debt/Loan tracking: Entering principal, interest rate, minimum payment, and monitoring balance changes.
    - Loan Amortization Schedules: Generate and visualize amortization schedules.
- Advanced Budgeting:
    - Support for other budgeting types beyond envelope style (e.g., zero-based, percentage-based).
    - Inter-Envelope Transfers: Ability to move allocated funds between budget envelopes.
    - Category Groups:
        - Allow users to group related categories (e.g., "Subscriptions" containing "Netflix", "Disney+").
        - Implement color-coding options for these groups for enhanced visual organization.
- Personalized Financial Insights:
    - Basic analysis of user spending patterns to provide actionable insights (e.g., identifying recurring subscriptions, highlighting unusual spending spikes, suggesting budget adjustments).
- Investment & Asset Tracking:
    - Modules for manually tracking investments (stocks, bonds, funds) and other assets (real estate, vehicles) for a more complete net worth picture.
- Notifications & Reminders:
    - Integration with operating system's notification center or calendar for bill reminders and budget alerts.
- Data Sync (Self-Hosted Option):
    - Implement an optional, privacy-preserving synchronization mechanism for encrypted data across multiple devices using a self-hosted solution (e.g., WebDAV, Dropbox folder sync with local encryption).
- Bank Integration (Opt-in, Encrypted):
    - Offer an optional feature for users to connect to financial institutions via a secure third-party service for automatic transaction import and account balance updates. Emphasize opt-in and encryption.
- Machine Learning for Categorization:
    - Develop a feature that learns from user categorization and suggests/automates categorization for new transactions.
- Multi-Currency Support:
    - Allow users to track accounts and budgets in multiple currencies.
- Automated Backup System:
    - Implement a feature to perform automatic local backups of the encrypted data file at a configurable frequency (e.g., daily).
- Dark Mode:
    - Offer a dark theme for the user interface.
- Drag & Drop:
    - Implement drag-and-drop functionality for reordering budget categories within a budget period.
- Income & Expense Management:
    - Support marking transactions as "Cleared" vs. "Pending".

## 10. References

- [10 Must-Try Features in Personal Finance Apps Today - Number Analytics](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today)
- [Manage All Accounts In One Place | Mint](https://mint.intuit.com/how-mint-works/)
- [The Best Budget Apps for 2025 - NerdWallet](https://www.nerdwallet.com/article/finance/best-budget-apps)
- [Goodbudget vs. EveryDollar. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-everydollar-which-budget-app-is-for-you/)
- [Monarch Money Budgeting App Review - Business Insider](https://www.businessinsider.com/personal-finance/banking/monarch-money-review)
- [Actual: An Open-Source Privacy-Friendly Personal Finance App - ItsFOSS News](https://news.itsfoss.com/actual-finance-app/)
- [YNAB Budget Reports: See Your Spending Trends | YNAB](https://www.ynab.com/blog/ynab-reports-and-data)
- [Goodbudget vs. YNAB. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-ynab-which-budget-app-is-for-you/)

---

*This document outlines the Minimum Viable Product requirements for the personal finance application. Development will prioritize building a stable, privacy-focused, and user-friendly local experience with strong core workflows for income/expense tracking and budgeting. The design should be modular and extensible to accommodate the planned future enhancements.*
