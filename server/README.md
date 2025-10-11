# Bank Management System - Server

Backend API server for the Bank Management System built with Node.js, Express.js, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   - Follow instructions in `database-setup/README.md`
   - Update database connection in `database.js`

3. **Start Server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📁 Project Structure

```
server/
├── app.js                 # Main application file
├── database.js           # Database connection configuration
├── package.json          # Dependencies and scripts
├── database-setup/       # Database setup files
│   ├── complete_db_setup.sql
│   ├── add_customers.sql
│   └── README.md
└── README.md             # This file
```

## 🔧 Configuration

### Database Configuration
Update `database.js` with your PostgreSQL connection details:

```javascript
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'bank_management_system',
  password: 'your_password',
  port: 5432,
});
```

### Environment Variables (Optional)
Create a `.env` file for environment-specific configurations:

```env
DB_USER=your_username
DB_HOST=localhost
DB_NAME=bank_management_system
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
```

## 🛠️ API Endpoints

### Authentication
- `POST /customer/login` - Customer login
- `POST /employee/login` - Employee login
- `POST /manager/login` - Manager login

### Customers
- `GET /customer` - Get all customers
- `POST /customer` - Create new customer
- `PUT /customer/:id` - Update customer
- `DELETE /customer/:id` - Delete customer

### Employees
- `GET /employee` - Get all employees
- `POST /employee` - Create new employee
- `PUT /employee/:id` - Update employee
- `DELETE /employee/:id` - Delete employee

### Branches
- `GET /branch` - Get all branches
- `POST /branch` - Create new branch
- `PUT /branch/:id` - Update branch
- `DELETE /branch/:id` - Delete branch

### Accounts
- `GET /accounts/:customer_id` - Get customer accounts
- `POST /accounts` - Create new account
- `DELETE /accounts/:id` - Delete account

### Transactions
- `GET /transaction/:customer_id` - Get customer transactions
- `POST /transaction` - Create new transaction

## 🔒 Security Features

- CORS enabled for cross-origin requests
- SQL injection protection with parameterized queries
- Input validation and sanitization
- Role-based access control

## 📦 Dependencies

### Production Dependencies
- `express` - Web framework
- `pg` - PostgreSQL client
- `cors` - Cross-origin resource sharing

### Development Dependencies
- `nodemon` - Development server with auto-reload

## 🚀 Deployment

### Local Deployment
```bash
npm start
```
Server runs on `http://localhost:5000`

### Production Deployment
1. Set up PostgreSQL database
2. Run database setup scripts
3. Configure environment variables
4. Install production dependencies: `npm ci --production`
5. Start with process manager: `pm2 start app.js`

## 🔍 Health Check

Verify server is running:
```bash
curl http://localhost:5000/branch
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify PostgreSQL is running
   - Check database credentials in `database.js`
   - Ensure database exists

2. **Port Already in Use:**
   - Change port in `app.js` or set PORT environment variable

3. **Module Not Found:**
   - Run `npm install` to install dependencies

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

---

**Server Status:** Production Ready ✅  
**Last Updated:** October 2025