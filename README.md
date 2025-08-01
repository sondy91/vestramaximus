# VestraMaximus

## High Level Data Diagram

```text
+----------------+          +--------------------+
| BudgetPeriod   |1        *| BudgetAllocation   |
|----------------|          |--------------------|
| id PK          |<--+   +--| id PK             |
| name           |   |   |  | period_id FK -----+
| start_date     |   |   |  | category_id FK     |
| end_date       |   |   |  | planned_amount     |
| status         |   |   |  +--------------------+
+----------------+   |   |
                     |   |     +----------------+
                     |   +----<| BudgetCategory |
                     |         |----------------|
                     |         | id PK          |
                     |         | name           |
                     |         | type (enum)    |
                     |         | parent_id FK?  |
                     |         +----------------+
                     |
                     |   +----------------+
                     +--<| Transaction    |
                         |----------------|
                         | id PK          |
                         | date           |
                         | amount (signed)|
                         | payee          |
                         | notes          |
                         | category_id FK |
                         | period_id FK   |
                         +----------------+

Backup(id PK, timestamp, filepath, status)
AuditLog(id PK, timestamp, action, entity, entity_id, summary)
```

> Note: Transaction.period_id is redundant but speeds up queries for “current budget.”
>
> Add indexes on Transaction(category_id, date) and Transaction(period_id).