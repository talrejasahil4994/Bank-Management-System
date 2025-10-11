# 🏦 Bank Management System

A comprehensive full-stack banking application built with React.js frontend and Node.js/Express backend, featuring role-based access control for customers, employees, and managers.

## 🌟 Features

### 👤 Customer Portal
- **Secure Authentication**: Username/password login system
- **Account Management**: View account details and balances
- **Transaction History**: Complete transaction records
- **Account Creation**: Create new bank accounts
- **Modern UI**: Responsive design with intuitive navigation

### 👨‍💼 Employee Dashboard  
- **Customer Management**: Add, edit, delete customer records
- **Account Operations**: Create accounts for customers
- **Secure Access**: Role-based authentication
- **Data Management**: Search and filter functionality

### 🏢 Manager Control Panel
- **Full Administrative Access**: All employee features plus:
- **Employee Management**: Hire, update, remove employees
- **Branch Administration**: Manage bank branch locations
- **System Oversight**: Complete system control

## 🚀 Live Demo

**Frontend**: [Your deployed client URL]  
**Backend API**: [Your deployed server URL]

### Test Credentials
```
Customer Login:
Username: [sample_customer]
Password: [sample_password]

Employee Login:
Username: [sample_employee] 
Password: [sample_password]

Manager Login:
Username: [sample_manager]
Password: [sample_password]
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - Component-based UI library
- **React Router** - Client-side routing
- **Bootstrap** - CSS framework for responsive design
- **Custom CSS** - Enhanced styling and mobile responsiveness

### Backend  
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** with comprehensive schema
- **Stored Procedures** for data operations
- **Relationships** between entities
- **Sample Data** for testing

## 📁 Project Structure

```
Bank-Management-System/
├── client/                    # React frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── images/           # Image assets
│   │   ├── App.js            # Main App component
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── .env.example          # Environment variables template
├── server/                   # Node.js backend
│   ├── database-setup/       # SQL setup scripts
│   │   ├── complete_db_setup.sql
│   │   ├── add_customers.sql
│   │   └── README.md
│   ├── app.js               # Express server
│   ├── database.js          # Database connection
│   ├── package.json
│   ├── .env.example         # Environment variables template
│   ├── Procfile             # Deployment configuration
│   └── DEPLOYMENT.md        # Detailed deployment guide
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Local Development

1. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd Bank-Management-System
   ```

2. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb bank_management
   
   # Run setup scripts
   cd server/database-setup
   psql -d bank_management -f complete_db_setup.sql
   psql -d bank_management -f add_customers.sql
   ```

3. **Start Backend**
   ```bash
   cd server
   npm install
   npm start
   # Server runs on http://localhost:5000
   ```

4. **Start Frontend**
   ```bash
   cd client
   npm install
   npm start
   # Client runs on http://localhost:3000
   ```

## 🌐 Deployment Options

### 🎯 Recommended: Railway (Free & Easy)

1. **Deploy Backend**:
   - Push code to GitHub
   - Connect Railway to your repository
   - Add PostgreSQL database service
   - Configure environment variables
   - Deploy automatically

2. **Deploy Frontend**:
   - Use Vercel, Netlify, or Railway
   - Set API URL environment variable
   - Deploy with one click

### 🔧 Alternative: Heroku

```bash
# Backend deployment
heroku create your-bank-system
heroku addons:create heroku-postgresql:mini
git push heroku main

# Frontend deployment  
cd client
npm run build
# Deploy build folder to your preferred hosting
```

**📖 For detailed deployment instructions, see [`server/DEPLOYMENT.md`](server/DEPLOYMENT.md)**

## 🔒 Security Features

- **Authentication**: Secure login system for all user roles
- **Session Management**: Proper session handling and logout
- **Data Protection**: Parameterized queries prevent SQL injection
- **Input Validation**: Client and server-side validation
- **CORS Configuration**: Controlled cross-origin access

## 📱 Mobile Responsive

- **Mobile-First Design**: Optimized for mobile devices
- **Responsive Tables**: Card-based layout on small screens
- **Touch-Friendly**: Proper button sizing and spacing
- **Adaptive Navigation**: Collapsible menus and sections

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Intuitive Navigation**: Easy-to-use back button system
- **Loading States**: Visual feedback for user actions
- **Toast Notifications**: Real-time status updates
- **Error Handling**: User-friendly error messages
- **Dark/Light Themes**: Professional color schemes

## 📊 Database Schema

### Tables
- **customers** - Customer information and credentials
- **employees** - Employee data and access levels  
- **managers** - Manager accounts with full access
- **branches** - Bank branch locations
- **accounts** - Customer bank accounts
- **transactions** - Transaction history and records

### Key Features
- **Referential Integrity**: Foreign key constraints
- **Data Validation**: Check constraints and triggers
- **Optimized Queries**: Indexed columns for performance
- **Sample Data**: Pre-populated test data

## 🔧 API Endpoints

### Authentication
- `POST /customer/login` - Customer authentication
- `POST /employee/login` - Employee authentication  
- `POST /manager/login` - Manager authentication

### Customer Operations
- `GET /customer` - List all customers
- `POST /customer` - Create new customer
- `PUT /customer/:id` - Update customer details
- `DELETE /customer/:id` - Remove customer

### Account Management
- `GET /accounts/:customer_id` - Get customer accounts
- `POST /accounts` - Create new account
- `DELETE /accounts/:id` - Close account

### Transactions
- `GET /transaction/:customer_id` - Transaction history
- `POST /transaction` - Process new transaction

**📚 Full API documentation available at `/` endpoint when server is running**

## 🧪 Testing

### Manual Testing Checklist
- [ ] Customer login and dashboard
- [ ] Employee operations
- [ ] Manager administrative functions
- [ ] Account creation and management
- [ ] Transaction processing
- [ ] Responsive design on mobile
- [ ] Error handling and validation

### Sample Test Data
The database includes pre-populated test data for immediate testing of all features.

## 🔄 Version History

- **v1.0.0** - Initial release with full functionality
- **v1.1.0** - Added mobile responsiveness
- **v1.2.0** - Enhanced navigation with back buttons
- **v1.3.0** - Deployment-ready configuration

## 📞 Support & Contributing

### Issues
Report bugs or request features by creating GitHub issues.

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

## 🎯 Future Enhancements

- [ ] Email notifications for transactions
- [ ] Advanced reporting and analytics
- [ ] Multi-factor authentication
- [ ] API rate limiting
- [ ] Real-time updates with WebSockets
- [ ] Mobile app development
- [ ] Integration with payment gateways

---

## 🚀 Ready to Deploy?

1. **Quick Deploy**: Use Railway for fastest deployment
2. **Custom Deploy**: Follow detailed guide in [`server/DEPLOYMENT.md`](server/DEPLOYMENT.md)
3. **Local Testing**: Set up development environment

**Your Bank Management System is production-ready! 🎉**

Made with ❤️ for modern banking solutions