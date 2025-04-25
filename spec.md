# Personal Finance MVP Requirements

## 1. MVP Overview

- **Goal**: Replace spreadsheet-based personal finance tracking with a streamlined, privacy-focused local desktop application.
- **Scope**: Core functionalities include comprehensive income and expense tracking, flexible budgeting (with an envelope-style approach), forward-looking cash flow forecasting, intuitive dashboards for financial health visualization, easy mid-period financial adjustments, and support for managing finances for multiple individuals within a household.
- **Deployment**: **Local-only** for the initial release. This means all data is stored and processed exclusively on the user's device. There will be no cloud synchronization, direct bank integrations (via APIs), or external data sharing in the MVP.

## 2. User Personas

1. **Individual Earner**
    - *Description*: Someone managing their own finances, typically with one or two primary income sources (hourly or salaried).
    - *Needs*: Simple and quick transaction entry, clear tracking of spending against a budget, timely alerts for budget thresholds, and an easy-to-understand snapshot of their current financial position and net worth.
2. **Couple / Household Manager**
    - *Description*: Individuals managing shared finances for a household, often with multiple income streams and shared financial goals.
    - *Needs*: Ability to track income and expenses attributable to different individuals within the household, shared budgeting capabilities with the option for per-person or per-purpose tagging, consolidated views of household finances, and tools to manage shared accounts and debts.

## 3. User Stories

- **Income & Cash Flow**
  - As a user, I want to define my regular pay schedule (e.g., weekly, bi-weekly, semi-monthly, monthly) so I can accurately forecast my expected cash flow over time.
  - As a user, I want to add multiple income sources with different types (e.g., hourly wages requiring hour entry, fixed salary, per-project contract income) and associate them with a specific person in the household.
  - As a user, I want to record a one-off bonus, unexpected income, or a deduction mid-pay period and see its immediate impact on my budget and forecasted balance.
- **Expense & Transaction Management**
  - As a user, I want to manually log individual income and expense transactions quickly and easily, assigning them to specific categories and optionally adding notes, so I can track every financial movement without relying on bank connections.
  - As a user, I want to set up recurring transactions (like monthly rent, subscriptions, or regular paychecks) with customizable frequencies (weekly, bi-weekly, monthly, annually, etc.) so that these predictable entries are automatically added to my financial records and forecasts.
  - As a user, I want to import my transaction history in bulk from standard file formats (like CSV, OFX, QIF) exported from my bank, so I can quickly populate the application with historical data and reduce manual entry.
  - As a user, I want to be able to review imported transactions, easily recategorize them if necessary, and merge or edit entries before they are finalized in my records.
- **Budgeting**
  - As a user, I want to set up budgets (or 'envelopes') for different spending categories (e.g., Groceries, Utilities, Entertainment) for a defined period (e.g., monthly), allocating a specific amount to each.
  - As a user, I want to see at a glance how much of my budget I have spent in each category and how much is remaining, ideally with a visual indicator like a progress bar, to help me stay within my spending limits.
  - As a user, I want to receive alerts or notifications when my spending in a specific budget category is nearing or has exceeded the allocated amount, to help me enforce budget discipline in real-time.
  - As a couple managing shared finances, we want to define shared budget categories and have the option to tag transactions within those categories by the person who incurred the expense.
- **Financial Planning & Forecasting**
  - As a user, I want to see a forecast of my account balances based on my scheduled income and expenses, projected over a defined period (e.g., end of the current budget period, next few months).
  - As a user, I want to perform "what-if" scenarios, such as temporarily adding an extra expense or income source, to see how it would impact my budget and forecast without affecting my actual data.
  - As a user, I want to create savings goals (e.g., an emergency fund, down payment) and debt payoff goals (e.g., specific loans or credit cards) and track my progress towards these targets.
  - As a user, I want to track my outstanding loans and credit card debts, entering details like the principal amount, interest rate, and minimum payment, so I can monitor how my payments affect the balance over time.
- **Dashboard & Reporting**
  - As a user, I want a customizable dashboard that provides an at-a-glance summary of my key financial metrics, such as current account balances, net cash flow for the period, savings rate, and upcoming bills.
  - As a user, I want to view visual reports (e.g., pie charts, bar graphs) that break down my spending by category over different time periods, so I can easily identify spending patterns and areas where I might save.
  - As a user, I want to see reports or charts illustrating my income vs. expenses over time and track trends in my financial habits to see if I am improving.
  - As a user, I want to generate and export custom reports (e.g., PDF or CSV) for specific date ranges, filtered by categories, persons, or accounts, for external analysis or record-keeping.
  - As a user, I want to see a consolidated view of all my financial accounts (checking, savings, credit cards, loans, etc.) and a calculated net worth (Assets - Liabilities).
- **Notifications & Reminders**
  - As a user, I want to receive reminders for upcoming bills or scheduled expenses as their due dates approach, so I don't miss payments.
- **Data Management & Security**
  - As a user, I want my sensitive financial data to be stored exclusively on my local device, encrypted at rest, to ensure my privacy and prevent unauthorized third-party access.
  - As a user, I want the option to set a local PIN or password to access the application, adding an extra layer of security for my data on the device.
  - As a user, I want the application to automatically save my data regularly and provide options for periodic local backups, so I don't lose my financial records.
  - As a user, I want to be able to easily restore my financial data from a local backup file if needed.

## 4. Functional Requirements

### 4.1 Income Management

- **Pay Cadence Configuration**:
  - Allow users to define recurring income sources with specified frequencies: Weekly, Bi-weekly, Semi-monthly, Monthly, Quarterly, Annually, or Custom (e.g., every 'n' weeks/months).
  - Support setting a start date for recurring income.
- **Income Type Handling**:
  - **Salaried/Fixed**: Define a fixed amount received on a schedule.
  - **Hourly**: Allow logging hours worked per pay period, with the application calculating the gross pay based on a defined hourly rate. Support different rates (e.g., standard, overtime).
  - **Project/Contract**: Allow logging lump sum income upon completion or on specific dates.
- **Multiple Income Streams**:
  - Enable users to add an unlimited number of distinct income sources.
  - Each income source can be tagged with an associated "Person" profile.
  - Allow for categorizing income (e.g., Primary Job, Side Hustle, Rental Income).
- **Mid-Period Income Adjustments**:
  - Provide a mechanism to easily add one-off income (e.g., a bonus) or deductions (e.g., unexpected tax withholding) that occur within a standard pay period.
  - These adjustments should immediately reflect in budget tracking and forecasting for the relevant period.

### 4.2 Expense & Transaction Tracking

- **Manual Transaction Entry**:
  - Input fields for Date, Amount, Description/Payee, Category, Account, and optional Notes.
  - Option to associate a transaction with a specific "Person".
  - Support marking transactions as "Cleared" vs. "Pending".
- **Recurring Transaction Setup**:
  - Configure transactions with specified amounts, categories, and frequencies (similar to income cadences).
  - Option to set an end date or recurrence count.
  - Automatically generate future instances of recurring transactions in the ledger/forecast.
- **Categorization System**:
  - Allow users to create, edit, and delete custom expense and income categories.
  - Support creating subcategories within main categories for more granular tracking.
  - Enable assigning multiple tags to transactions (e.g., #work-expense, #gift).
- **Bulk Transaction Import**:
  - Implement parsers for common financial file formats: CSV, OFX, QIF.
  - Provide a mapping interface for CSV imports to match file columns to application data fields (Date, Amount, Description).
  - Offer a review screen after import to allow users to categorize and edit imported transactions before saving.
- **Import/Export Functionality**:
  - Allow exporting all financial data or filtered reports (based on date, category, etc.) to CSV format for external analysis or backup.
  - Support exporting application data in a proprietary encrypted format for backup and restore purposes.

### 4.3 Budgeting & Forecasting

- **Envelope Budgeting**:
  - Enable the creation of budget periods (e.g., monthly, bi-weekly) based on the user's pay schedule or custom dates.
  - Within each period, allow allocation of specific amounts to defined expense categories (the "envelopes").
  - Support rolling budgets where unspent amounts in a category can carry over to the next period (optional setting per category).
- **Budget Tracking Visualization**:
  - Display each budget category with the allocated amount, the amount spent so far, and the remaining balance.
  - Provide a visual progress bar or similar indicator showing the proportion of the budget spent.
  - Highlight categories that are over budget.
- **Budget Alerts**:
  - Allow users to set custom thresholds (e.g., 80% spent) for specific budget categories to trigger notifications.
  - Alert the user when spending in a category exceeds the allocated budget.
- **Cash Flow Forecasting**:
  - Generate a projected balance for accounts based on current balance, scheduled income, and scheduled recurring expenses within a defined future period.
  - Visualize forecasted balances over time (e.g., line graph).
- **"What-If" Analysis**:
  - Provide a simulation mode where users can temporarily add hypothetical transactions or adjust income/expense amounts to see the impact on the budget and forecast without saving the changes to their primary data.
- **Debt and Loan Tracking**:
  - Allow users to create debt accounts (loans, credit cards) with details like initial balance, interest rate, minimum payment, and lender.
  - Link expense transactions tagged as debt payments to reduce the principal balance of the associated debt account.
  - Track and display the current balance and payment history for each debt.

### 4.4 Dashboard & Reporting

- **Main Dashboard View**:
  - Configurable widgets displaying key metrics: Total current balance across selected accounts, Net cash flow for the current budget period, Savings rate (calculated as a percentage of income), List of upcoming bills/scheduled expenses with due dates.
  - Interactive charts:
    - Income vs. Expenses over a selected period (e.g., last 6 months) - Bar or Line chart.
    - Spending Breakdown by Category for the current period (or selected period) - Pie chart.
- **Detailed Reports**:
  - **Spending by Category Report**: Tabular and graphical (pie chart) view of spending per category for a selected date range, with drill-down capability into individual transactions within a category.
  - **Income Report**: List and sum of income received over a selected date range, filterable by person or source.
  - **Transaction History**: Filterable and searchable list of all transactions.
  - **Net Worth Report**: Track changes in Net Worth (Assets minus Liabilities) over time - Line chart.
- **Trend Analysis**:
  - Visualize spending patterns and income trends over longer periods to identify changes in financial habits.
  - Compare spending in categories across different budget periods.
- **Custom Report Generation**:
  - Allow users to define parameters (date range, categories, persons, accounts) for a report.
  - Export the generated report data to CSV format.

### 4.5 Account & Person Management

- **Account Creation**:
  - Allow users to create multiple financial accounts (e.g., Checking, Savings, Credit Card, Loan, Cash).
  - Define an initial balance for each account.
  - Associate transactions with specific accounts.
- **Account Aggregation**:
  - Calculate and display the total balance across selected or all accounts.
- **Person Profiles**:
  - Enable the creation of multiple "Person" profiles within the application (e.g., "Self", "Partner", "Child").
  - Associate income sources, transactions, and potentially budget allocations with specific person profiles.
- **Household Grouping**:
  - Aggregate financial data at the household level while retaining the ability to view or filter data per individual "Person".

## 5. Data Model (High-Level)

- **User (Local Only)**: Primary configuration and settings.
- **Person**: Represents an individual within the household.
  - Attributes: Name, [potentially link to associated Accounts/Income/Transactions for filtering].
- **Account**: Represents a financial account.
  - Attributes: Name, Type (Checking, Savings, Credit Card, Loan, Cash, etc.), Initial Balance, Current Balance.
- **IncomeSource**: Configuration for a recurring income stream.
  - Attributes: Name, Type (Salaried, Hourly, Contract), Cadence (Weekly, Monthly, etc.), Rate/Amount, Start Date, [Optional End Date], Associated Person.
- **PayPeriod**: Represents an instance of an expected income period.
  - Attributes: Start Date, End Date, Expected Gross Amount (calculated from IncomeSource), Status (Expected, Received, Adjusted).
- **Transaction**: Represents a single financial movement.
  - Attributes: Date, Amount, Type (Income, Expense, Transfer), Description/Payee, Category, Account, Associated Person (Optional), Notes, Status (Cleared, Pending).
- **Adjustment**: Represents a deviation from expected income within a PayPeriod (e.g., bonus, deduction).
  - Attributes: Amount, Description, Date, Linked PayPeriod.
- **BudgetCategory**: Defines a spending or income category for budgeting.
  - Attributes: Name, Type (Income, Expense), Parent Category (for subcategories), [potentially Default Allocation Hint].
- **BudgetPeriod**: Represents a specific instance of a budget (e.g., "June 2025 Budget").
  - Attributes: Start Date, End Date, Status (Open, Closed).
- **BudgetAllocation**: Links a BudgetPeriod to a BudgetCategory with an allocated amount.
  - Attributes: BudgetPeriod ID, BudgetCategory ID, Allocated Amount, [Optional: Carryover flag].
- **Goal**: Represents a savings or debt payoff target.
  - Attributes: Name, Type (Savings, Debt Payoff), Target Amount, Current Progress, Linked Account/Debt (Optional).
- **Debt**: Represents a specific loan or credit card liability.
  - Attributes: Name, Lender, Initial Principal, Interest Rate, Minimum Payment, Current Balance, Linked Account (Optional).
- **RecurringRule**: Defines the pattern for recurring transactions.
  - Attributes: Frequency Type (Weekly, Monthly, etc.), Interval (e.g., every '2' weeks), Day/Date specification, Start Date, [Optional End Date/Count]. (Links to Transactions/IncomeSources).
- **Backup**: Record of local backups.
  - Attributes: Timestamp, File Path, [Status (Success/Fail)].
- **AuditLog (Local Only)**: Record of changes to key data entities.
  - Attributes: Timestamp, User Action (Create, Update, Delete), Entity Type, Entity ID, Summary of Change.

## 6. UI/UX Requirements

- **Intuitive Navigation**: Clear and easy access to key sections: Dashboard, Transactions, Budgets, Reports, Accounts, Settings.
- **Data Entry Workflow**: Streamlined forms for adding transactions, income sources, and budget categories with minimal steps.
- **Responsive Design**: While desktop-first for MVP, the UI should be designed with a flexible layout approach that could potentially adapt to different window sizes if considering future tablet/mobile versions.
- **Interactive Data Visualization**: Charts should be interactive, allowing users to hover over data points for details, click on segments (e.g., a slice in a pie chart) to filter related transactions, and adjust date ranges easily.
- **Accessibility**: Ensure sufficient color contrast in charts and throughout the interface. Consider keyboard navigation accessibility.
- **Visual Budget Tracking**: Use clear progress bars, color-coding (e.g., green for under budget, yellow for nearing limit, red for over budget), and numerical displays for budget remaining.
- **Drag & Drop**: Implement drag-and-drop functionality for reordering budget categories or potentially rearranging dashboard widgets.
- **Clear Feedback**: Provide clear visual confirmation for successful actions (e.g., transaction saved) and informative error messages.

## 7. Non-Functional Requirements

- **Deployment Environment**: Desktop application for Windows, macOS, and Linux (specify initial target platforms if needed).
- **Local-Only Data Storage**: All application data (transactions, budgets, user profiles, etc.) must reside solely on the user's local storage device.
- **Performance**:
  - Key views (Dashboard, Current Budget Period) should load and display data within 1-2 seconds, even with several years of transaction history (e.g., up to 5,000-10,000 transactions).
  - Transaction entry should be near instantaneous.
  - Report generation for a typical date range (e.g., 1 year) should complete within a few seconds.
- **Security**:
  - Data at Rest: All sensitive financial data stored locally must be encrypted using a strong, industry-standard encryption algorithm. The encryption key should be managed securely on the user's device.
  - Application Access: Implement an optional local PIN or password requirement upon launching the application after a period of inactivity. Biometric authentication could be a future enhancement.
- **Reliability**:
  - Autosave: Application state and data should be automatically saved frequently (e.g., every few minutes or after significant changes) to prevent data loss in case of unexpected application closure or system issues.
  - Local Backup System: Implement a feature to perform automatic local backups of the encrypted data file at a configurable frequency (e.g., daily).
  - Manual Backup/Restore: Provide a user-initiated option to create a manual backup file and to restore data from a previously created backup file, with clear warnings about data overwriting.
- **Scalability (within MVP scope)**: The architecture should be able to handle a reasonable amount of local data (e.g., up to 5-10 years of typical personal financial transactions) without significant performance degradation.
- **Data Integrity**: Implement validation rules to ensure data consistency (e.g., prevent transactions with negative amounts unless representing specific adjustments, ensure category assignments are valid).

## 8. Error Handling & Audit

- **Input Validation**: Implement robust validation on user input fields (e.g., ensure numeric fields contain numbers, required fields are filled, dates are valid). Provide clear feedback to the user on validation errors.
- **Data Consistency Checks**: Implement checks to prevent logical inconsistencies (e.g., allocating a budget to a deleted category, transactions linked to non-existent accounts).
- **Graceful Error Handling**: The application should not crash on errors. Instead, it should log errors internally (locally) and potentially notify the user in a non-disruptive way if an action failed.
- **Local Audit Trail**: Maintain a local, immutable log of significant data changes (creation, modification, deletion of transactions, accounts, budgets, etc.). This trail is for debugging and data integrity verification, not a user-facing feature in the MVP.

## 9. Future Enhancements (Post-MVP)

- **Data Sync (Self-Hosted Option)**: Implement an optional, privacy-preserving synchronization mechanism, potentially allowing users to sync their encrypted data across multiple devices using a self-hosted solution (e.g., WebDAV, Dropbox folder sync with local encryption).
- **Bank Integration (Opt-in, Encrypted)**: Offer an *optional* feature for users to connect to financial institutions via a secure third-party service (like Plaid or equivalent, if local-first compatible options exist) for automatic transaction import and account balance updates. Emphasize that this is opt-in and user data remains encrypted.
- **Machine Learning for Categorization**: Develop a feature that learns from the user's manual categorization of transactions and suggests or automatically assigns categories to new, similar imported transactions.
- **Personalized Financial Insights**: Implement basic analysis of user spending patterns to provide actionable insights (e.g., identifying recurring subscriptions, highlighting unusual spending spikes, suggesting budget adjustments based on habits).
- **Multi-User Collaboration**: Enhance the "Person" feature to support shared access and potentially different permission levels within a household account.
- **Tax Estimation**: Add a feature to estimate potential tax liabilities based on income and categorized expenses (particularly useful for freelance/contract workers).
- **Advanced Goal Tracking**: More sophisticated tracking for savings goals (e.g., allocating specific transactions or budget amounts to a goal) and debt payoff goals (e.g., simulating different payoff strategies like snowball or avalanche).
- **Inter-Account & Inter-Envelope Transfers**: Explicitly support transactions representing money moving between different financial accounts and the ability to move allocated funds between budget envelopes.
- **Multi-Currency Support**: Allow users to track accounts and budgets in multiple currencies, with the ability to specify exchange rates or fetch them (carefully, respecting the local-only principle where possible or making it an opt-in feature).
- **Investment & Asset Tracking**: Add modules for manually tracking investments (stocks, bonds, funds) and other assets (real estate, vehicles) to provide a more complete net worth picture.
- **Calendar & System Notifications**: Integrate bill reminders and budget alerts with the operating system's notification center or calendar.
- **Split Transactions**: Allow a single transaction (e.g., a grocery run with some household items and some personal items) to be split and allocated across multiple budget categories or persons.
- **Loan Amortization Schedules**: Generate and visualize amortization schedules for tracked loans, showing principal and interest breakdown over time.
- **Dark Mode**: Offer a dark theme for the user interface.

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
