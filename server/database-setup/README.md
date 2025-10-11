# Database Setup Instructions

This folder contains the SQL files needed to set up the Bank Management System database.

## Files:

1. **complete_db_setup.sql** - Complete database schema with tables, constraints, and relationships
2. **add_customers.sql** - Sample customer data for testing

## Setup Process:

### Prerequisites:
- PostgreSQL installed and running
- Database user with CREATE privileges

### Steps:

1. **Create Database:**
   ```sql
   CREATE DATABASE bank_management_system;
   ```

2. **Run Schema Setup:**
   ```bash
   psql -d bank_management_system -f complete_db_setup.sql
   ```

3. **Add Sample Data (Optional):**
   ```bash
   psql -d bank_management_system -f add_customers.sql
   ```

4. **Verify Setup:**
   ```sql
   -- Connect to database
   \c bank_management_system
   
   -- List all tables
   \dt
   
   -- Check sample data
   SELECT COUNT(*) FROM customers;
   SELECT COUNT(*) FROM branches;
   ```

## Database Configuration:

Make sure to update your `../database.js` file with the correct database connection parameters:

```javascript
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'bank_management_system',
  password: 'your_password',
  port: 5432,
});
```

## Tables Created:

- `branches` - Bank branch information
- `customers` - Customer details and login credentials
- `employees` - Employee information
- `managers` - Manager information
- `accounts` - Customer bank accounts
- `transactions` - Account transaction history

For detailed schema information, refer to the SQL files in this directory.