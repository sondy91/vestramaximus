# Personal Finance MVP Requirements

## 1. MVP Overview

- **Goal**: Replace spreadsheet-based personal finance tracking with a streamlined local app.
- **Scope**: Income & expense tracking, budgeting, forecasting, dashboards, mid-period adjustments, multi-person grouping.
- **Deployment**: **Local-only** for initial release. No cloud sync or external data integrations.

## 2. User Personas

1. **Individual Earner**
   - Hourly or salaried.
   - Wants simple tracking, budget alerts, and net-worth snapshot.
2. **Couple / Household Manager**
   - Multiple income sources.
   - Shared budgets, subgroup tagging (e.g. “Rent”, “Groceries”).

## 3. User Stories

- *As a user*, I want to define my pay schedule (weekly, bi-weekly, semi-monthly, monthly) so I can forecast cash flow.
- *As a user*, I want to add multiple income sources (hourly, salary, contract) and group them by person.
- *As a couple*, we want shared budgets with per-person tags.
- *As a user*, I want to record a one-off bonus or unexpected expense mid-period and see its impact on my budget.
- *As a user*, I want to view dashboards showing income vs. expenses, savings rate, and total net worth, so I can get a quick overview of my financial health
  - Reference: ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=The%20cornerstone%20of%20any%20effective,bills%E2%80%94all%20on%20a%20single%20screen)) ([Manage All Accounts In One Place | Mint](https://mint.intuit.com/how-mint-works/#:~:text=Stay%20up%20to%20date%20with,your%20money%20accounts)).
- *As a user*, I want to track and simulate different debt payoff strategies (like snowball or avalanche), so I can understand when I might become debt-free and stay motivated.
- *As a user*, I want to receive alerts when I’m close to exceeding my budget categories' to help enforce budget discipline.
- *As a user*, I want to manually log income and expenses and assign them to categories, so that I can track my spending without connecting bank accounts
  - Reference: ([The Best Budget Apps for 2025 - NerdWallet](https://www.nerdwallet.com/article/finance/best-budget-apps#:~:text=Let%E2%80%99s%20start%20with%20the%20free,set%20reminders%20for%20bill%20payments)).
- *As a user*, I want to set budgets (or envelopes) for different expense categories and see my remaining amount (e.g. via a progress bar), so I know if I’m close to overspending in any category
  - Reference: ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=Modern%20budgeting%20tools%20have%20moved,approach%20follows%20the%20mathematical%20principle)) ([Goodbudget vs. EveryDollar. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-everydollar-which-budget-app-is-for-you/#:~:text=Y%20)).
- *As a user*, I want to create savings goals (like an emergency fund) or debt payoff goals and track how much I’ve saved or paid off so far, so I can stay motivated and see progres
  - Reference: ([Monarch Money Budgeting App Review](https://www.businessinsider.com/personal-finance/banking/monarch-money-review#:~:text=You%20can%20also%20make%20infinite,and%20indicate%20how%20much%20you)) ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=5)).
- *As a user*, I want reminders for upcoming bills or scheduled expenses, so I don’t forget to pay rent or utilities on time
  - Reference: ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=4)) ([The Best Budget Apps for 2025 - NerdWallet](https://www.nerdwallet.com/article/finance/best-budget-apps#:~:text=Let%E2%80%99s%20start%20with%20the%20free,set%20reminders%20for%20bill%20payments)).
- *As a user*, I want to import my bank statements from files (CSV/OFX/etc.) so I can quickly bring all my transaction history into the app
  - Reference: ([Actual: An Open-Source Privacy-Friendly Personal Finance App](https://news.itsfoss.com/actual-finance-app/#:~:text=There%20is%20even%20support%20for,financial%20file%20formats%2C%20and%20more)).
- *As a user*, I want my financial data stored only on my device (with encryption), so that no third party has access to it
  - Reference: ([Actual: An Open-Source Privacy-Friendly Personal Finance App](https://news.itsfoss.com/actual-finance-app/#:~:text=There%20is%20even%20support%20for,financial%20file%20formats%2C%20and%20more)) ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=applications%20like%20YNAB%20and%20Monarch,level%20security%20including)).
- *As a user*, I want to view charts or reports of my spending over time and by category, so I can identify patterns and find areas to save
  - Reference: ([YNAB Budget Reports: See Your Spending Trends | YNAB](https://www.ynab.com/blog/ynab-reports-and-data#:~:text=Data%20is%20an%20important%20part,overspending%2C%20and%20visualize%20your%20progress)).
- *As a user*, I want to set up recurring transactions (e.g. monthly bills or paychecks), so I don’t have to re-enter them every time they occur
  - Reference: ([Goodbudget vs. YNAB. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-ynab-which-budget-app-is-for-you/#:~:text=Create%20Scheduled%20Transactions)).
- *As a user*, I want to track my loans or credit card debt, so I can see how my payments reduce those balances over time
  - Reference: ([Goodbudget vs. YNAB. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-ynab-which-budget-app-is-for-you/#:~:text=Debt%20Tracking)).

## 4. Functional Requirements

### 4.1 Income Management

- **Pay Cadences**: Support weekly, bi-weekly, semi-monthly, monthly.
- **Rate Types**: Hourly (with hours logged), salaried, per-project/contract.
- **Multiple Streams**: Unlimited income sources; tag by “Person” or “Category.”
- **Adjustments**: Handle extra income or deductions mid-period.

### 4.2 Expense & Transaction Tracking

- **Manual & Recurring Expenses**: Set up subscriptions, bills, with differing cadences (weekly, every 2 weeks, annually, etc). Allow the user to schedule repeating transactions (monthly subscriptions, rent, salaries, etc.) so that future instances are automatically populated in the budget ([Goodbudget vs. YNAB. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-ynab-which-budget-app-is-for-you/#:~:text=Create%20Scheduled%20Transactions)).

- **Categorization**: Custom categories, subcategories, tags.
  - Allow the user to manually enter income/expense transactions (with category tags) and to import bulk transaction data from files (CSV/OFX/QIF). Users can then review and recategorize transactions as needed ([The Best Budget Apps for 2025 - NerdWallet](https://www.nerdwallet.com/article/finance/best-budget-apps#:~:text=Let%E2%80%99s%20start%20with%20the%20free,set%20reminders%20for%20bill%20payments)) ([Actual: An Open-Source Privacy-Friendly Personal Finance App](https://news.itsfoss.com/actual-finance-app/#:~:text=There%20is%20even%20support%20for,financial%20file%20formats%2C%20and%20more)).
  - **Import/Export Data:** Support importing transactions from standard bank file formats (CSV/OFX/QIF) for offline use, and exporting financial data or reports for backup or analysis ([Actual: An Open-Source Privacy-Friendly Personal Finance App](https://news.itsfoss.com/actual-finance-app/#:~:text=There%20is%20even%20support%20for,financial%20file%20formats%2C%20and%20more)).

### 4.3 Budgeting & Forecasting

- **Envelope Budgets**: Assign budgets per category and period. ([The Best Budget Apps for 2025 - NerdWallet](https://www.nerdwallet.com/article/finance/best-budget-apps#:~:text=Let%E2%80%99s%20start%20with%20the%20free,set%20reminders%20for%20bill%20payments)). Support flexible budgeting methods (e.g. percentage-based rules, variable income) and customizable category lists ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=Modern%20budgeting%20tools%20have%20moved,approach%20follows%20the%20mathematical%20principle)).
- **Budget Tracking**: Show remaining budget amounts per category and use progress bars or alerts when spending nears or exceeds a category budget ([Goodbudget vs. EveryDollar. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-everydollar-which-budget-app-is-for-you/#:~:text=Y%20)). (For example, provide a progress bar indicating how much of a monthly grocery budget has been spent.)
- **What-If Scenarios**: “If I get an extra \$500 this month, how does that affect my savings?”
- **Forecast View**: Project end-of-month balance based on scheduled income/expenses.
- **Debt/Lender Tracking:** Provide tools to enter and track loans or debt accounts, including balances and payment schedules, to monitor payoff progress ([Goodbudget vs. YNAB. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-ynab-which-budget-app-is-for-you/#:~:text=Debt%20Tracking)).

### 4.4 Dashboard & Reporting

- **At-a-Glance Dashboard**

  - Key metrics: Current balance, net cash flow, savings rate, upcoming bills.
  - Visuals: Bar/line charts for income vs. expenses, pie charts for category breakdown.
  - Aggregate and display all accounts and net worth on a customizable overview screen, along with visual breakdowns of spending by category and upcoming bills. Top apps provide such dashboards to give a clear snapshot of finances ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=The%20cornerstone%20of%20any%20effective,bills%E2%80%94all%20on%20a%20single%20screen)) ([Manage All Accounts In One Place | Mint](https://mint.intuit.com/how-mint-works/#:~:text=Stay%20up%20to%20date%20with,your%20money%20accounts)).

- **Reporting & Visualizations:** Generate clear visual reports (pie charts, bar/line graphs) of spending by category, cash flow over time, and net worth trends ([YNAB Budget Reports: See Your Spending Trends | YNAB](https://www.ynab.com/blog/ynab-reports-and-data#:~:text=Data%20is%20an%20important%20part,overspending%2C%20and%20visualize%20your%20progress)). Users should be able to filter by date range and category.

- **Trend Analysis**: Track financial habits over time to identify improvements or regressions.

- **Custom Reports**: Export PDF/CSV of any date range, filtered by category/person.

### 4.5 Grouping & Multi-Person Support

- **Profiles**: Create “Persons” and assign income/expenses.
- **Shared Accounts**: Joint checking, separate savings.
  - **Account Management:** Support multiple account types (checking, savings, credit cards, loans, etc.). Allow the user to manually create accounts (with initial balances) to represent any financial account, providing a consolidated net worth view ([Monarch Money Budgeting App Review](https://www.businessinsider.com/personal-finance/banking/monarch-money-review#:~:text=Monarch%20Money%27s%20primary%20purpose%20is,track%20the%20value%20of%20both)) ([Manage All Accounts In One Place | Mint](https://mint.intuit.com/how-mint-works/#:~:text=Stay%20up%20to%20date%20with,your%20money%20accounts)).

## 5. Data Model (High-Level)

- **User (Local Only)**
- **Person** (household member)
- **IncomeSource** (type, cadence, rate)
- **PayPeriod** (start, end, expected amount)
- **Transaction** (date, amount, category, person, notes)
- **Adjustment** (linked to PayPeriod)
- **BudgetCategory** (name, allocation, period)
- **Account** (type, balance)

## 6. UI/UX Requirements

- **Responsive Design**: Desktop-first, with future mobile scaling in mind.
- **Interactive Charts**: Hover tooltips, drill-down details.
- **Color Palette**: Accessible colors for charts.
- **Drag & Drop**: Reorder categories, adjust envelope budgets visually.

## 7. Non-Functional Requirements

- **Local-Only**: All data stored and processed on device. No cloud sync.

- **Performance**: Dashboard loads in <1s for up to 2 years of data.

- **Security**: Data encrypted at rest; optional local PIN/password.
  - **Local Data Security:** Store all user data only on the device (or optionally on a self-hosted sync server). Provide strong data protection (e.g. encryption at rest) and require a passcode/biometric login to access the app ([Actual: An Open-Source Privacy-Friendly Personal Finance App](https://news.itsfoss.com/actual-finance-app/#:~:text=There%20is%20even%20support%20for,financial%20file%20formats%2C%20and%20more)) ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=applications%20like%20YNAB%20and%20Monarch,level%20security%20including)).

- **Reliability**: Autosave and periodic local backups.

  - **Backup Frequency**: Automatic backup every 24 hours, with option for manual export.
  - **Backup Format**: Encrypted JSON or SQLite file.
  - **Restore Process**: Accessible via Settings; restore from local file with overwrite warning.

## 8. Error Handling & Audit

- **Validation**: Prevent overlapping pay periods, negative budgets.
- **Audit Trail**: Local-only history of key entity changes (create/update/delete).

## 9. Future Enhancements (Post-MVP)

- **Bank Synchronization (optional):** Offer an option to connect to financial institutions or use APIs (with user consent) for automatic transaction importing and balance updates, similar to Monarch or EveryDollar Premium ([The Best Budget Apps for 2025 - NerdWallet](https://www.nerdwallet.com/article/finance/best-budget-apps#:~:text=Let%E2%80%99s%20start%20with%20the%20free,set%20reminders%20for%20bill%20payments)) ([Actual: An Open-Source Privacy-Friendly Personal Finance App](https://news.itsfoss.com/actual-finance-app/#:~:text=There%20is%20even%20support%20for,financial%20file%20formats%2C%20and%20more)).
- **Machine-Learning Categorization:** Add smart auto-categorization that learns from the user’s past edits, reducing the need for manual categorization ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=Automatic%20transaction%20categorization%20has%20become,align%20with%20individual%20budgeting%20approaches)).
- **Personalized Insights:** Provide AI-driven suggestions (e.g. highlight recurring subscriptions to cancel, or recommend adjusting budget allocations) based on user spending patterns ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=The%20integration%20of%20artificial%20intelligence,actions%20to%20improve%20financial%20health)).
- **Multi-User Support**: Shared households with permissions.
- **Tax Estimator**: Estimate quarterly taxes for contractors.
- **Goal Tracking**: Savings goals with progress bars.
  - Enable creation of multiple savings or debt-payoff goals (e.g. emergency fund, loan payoff) with clear progress indicators. Users can allocate funds to goals and see progress towards each target ([Monarch Money Budgeting App Review](https://www.businessinsider.com/personal-finance/banking/monarch-money-review#:~:text=You%20can%20also%20make%20infinite,and%20indicate%20how%20much%20you)) ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=5)).
- **Transfers:** Support transferring money between accounts and between budget envelopes. For example, a user can move funds from a checking account to a savings envelope (or from one category/envelope to another) ([Goodbudget vs. YNAB. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-ynab-which-budget-app-is-for-you/#:~:text=Account%20Transfers)).
- **Multi-Currency Support:** Support budgets in multiple currencies with automatic exchange rates, for users with foreign accounts (since many apps currently lack this, as Goodbudget notes).
- **AI Insights**: Personalized saving tips, anomaly detection.
- **Cross-Platform Support:** Ensure the app runs on multiple platforms (mobile and desktop). Provide a consistent experience on iOS, Android, Windows, macOS (and web/tablet if applicable) ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=Today%E2%80%99s%20users%20expect%20seamless%20experiences,Empower%20offer%20consistent%20experiences%20across)) ([Actual: An Open-Source Privacy-Friendly Personal Finance App](https://news.itsfoss.com/actual-finance-app/#:~:text=There%20is%20even%20support%20for,financial%20file%20formats%2C%20and%20more)). If syncing across devices is offered, it must use privacy-preserving, end-to-end encrypted methods.
- Dark Mode
- Loan Amortization schedules and graphs
- **Investment and Crypto Tracking:** Allow users to enter and track investment accounts or cryptocurrency holdings, with portfolio summaries (like mint alternatives provide) ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=6)).
- **Calendar & Notification Integration:** Sync bill reminders with device calendars and offer push notifications/SMS alerts for due dates or unusual spending ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=4)).
- **Collaborative Budgeting:** Enable sharing or syncing of budgets between multiple devices or users (e.g. couples, family accounts) in a privacy-safe way ([Goodbudget vs. EveryDollar. Which budget app is for you? | Goodbudget](https://goodbudget.com/blog/2022/12/goodbudget-vs-everydollar-which-budget-app-is-for-you/#:~:text=Goodbudget%20is%20versatile%20and%20can,just%20tracking%20their%20spending%20retroactively)).
- **Voice and Wearable Interfaces:** Integrate with voice assistants (e.g. Alexa, Siri) or smartwatches for quick expense entry and alerts ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=Today%E2%80%99s%20users%20expect%20seamless%20experiences,Empower%20offer%20consistent%20experiences%20across)).
- **Two-Factor Authentication:** Add an extra security layer (2FA) for user login or syncing to enhance protection ([10 Must-Try Features in Personal Finance Apps Today](https://www.numberanalytics.com/blog/must-try-features-personal-finance-apps-today#:~:text=applications%20like%20YNAB%20and%20Monarch,level%20security%20including)).
- **Split Transactions**: Allocate one transaction across multiple budgets.

---

> *This document outlines the Minimum Viable Product. Prioritize local-first simplicity, strong core workflows, and extendable design.*
