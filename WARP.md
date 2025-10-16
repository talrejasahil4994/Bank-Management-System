# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A full-stack Bank Management System with a Node.js/Express backend, React frontend, and PostgreSQL database. The system supports three user roles: Customers, Employees, and Managers, with role-based authentication and operations.

## Development Commands

### Backend (Server)
```bash
# Install dependencies
cd server && npm install

# Development with auto-reload
cd server && npm run dev

# Production server
cd server && npm start

# Test database connection
curl http://localhost:5000/health
curl http://localhost:5000/debug/db-test
```

### Frontend (Client)
```bash
# Install dependencies  
cd client && npm install

# Development server
cd client && npm start

# Production build
cd client && npm run build

# Run tests
cd client && npm test
```

### Full Stack Development
```bash
# Root commands (from project root)
npm install    # Installs server dependencies
npm start      # Starts production server
npm run dev    # Starts development server
```

## Database Setup

The database setup uses PostgreSQL with several SQL scripts:

```bash
# Database setup files location
server/database-setup/
├── complete_db_setup.sql    # Main schema and stored procedures  
└── add_customers.sql        # Sample customer data

# Initialize database (run SQL files in order)
# 1. complete_db_setup.sql - Creates tables, procedures, sample managers/employees/branches
# 2. add_customers.sql - Adds sample customer data
```

## Architecture Overview

### Backend Structure
- **`app.js`** - Main Express server with all API endpoints
- **`database.js`** - PostgreSQL connection pool configuration
- **API Architecture**: RESTful endpoints organized by entity type

### Database Schema
Core entities with relationships:
- **Users**: `customer`, `emp_login`, `manager_login` (role-based auth)
- **Banking**: `branch`, `accounts`, `transaction`
- **Relationships**: Customer → Accounts → Transactions

### Frontend Structure
- **React SPA** with React Router for navigation
- **Role-based routing** with separate interfaces for Customer/Employee/Manager
- **`src/utils/api.js`** - Centralized API configuration
- **Bootstrap 4** for styling

## API Endpoints

### Authentication
- `POST /customer/login` - Customer authentication
- `POST /employee/login` - Employee authentication  
- `POST /manager/login` - Manager authentication

### Entity Management (CRUD)
- **Customers**: `/customer` (GET, POST, PUT, DELETE)
- **Employees**: `/employee` (GET, POST, PUT, DELETE)  
- **Branches**: `/branch` (GET, POST, PUT, DELETE)
- **Accounts**: `/accounts` (GET, POST, DELETE)
- **Transactions**: `/transaction` (GET, POST)

### Customer-specific
- `GET /accounts/:customer_id` - Get customer accounts
- `GET /transaction/:customer_id` - Get customer transactions
- `GET /customer/:username` - Get customer by username

## Database Configuration

The system supports two connection methods:

1. **Cloud/Production**: Uses `DATABASE_URL` environment variable
2. **Local Development**: Uses individual DB environment variables

### Environment Variables
```env
# Option 1: Cloud databases (Neon, Heroku, etc.)
DATABASE_URL=postgresql://user:password@host:port/database

# Option 2: Individual variables (local development)
DB_HOST=localhost
DB_NAME=BANK  
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432 (or 5433 for local)

# Server configuration
NODE_ENV=development
PORT=5000
```

## Error Handling Patterns

The server implements:
- **Dual-strategy database operations**: Tries stored procedures first, falls back to direct SQL
- **Transaction management**: Uses database transactions for money operations
- **Comprehensive error logging**: Detailed error messages for debugging
- **Graceful degradation**: Continues operating even if some features fail

## Role-Based Access

The system has three distinct user interfaces:
- **Customer**: View accounts, transactions; perform basic banking operations
- **Employee**: Manage customer accounts and transactions
- **Manager**: Full administrative access including employee management

## Development Notes

### Database Fallback Strategy
Most operations first attempt to use stored procedures, then fall back to direct SQL INSERT/UPDATE statements. This ensures compatibility across different PostgreSQL setups.

### API Response Format
All endpoints return consistent JSON responses:
```javascript
{
  "success": boolean,
  "message": "descriptive message",
  "data": {} // entity-specific data
}
```

### Frontend API Configuration
The React app uses environment variables for API URL configuration:
- Development: `http://localhost:5000`
- Production: Set via `REACT_APP_API_URL`

## Testing Database Connection

Use the health check endpoints to verify system status:
- `/ping` - Basic server health (no DB required)
- `/health` - Full health check with database connection
- `/debug/db-test` - Database connection test
- `/debug/tables` - Database structure inspection