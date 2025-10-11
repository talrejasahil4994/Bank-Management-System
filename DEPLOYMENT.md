# 🚀 Bank Management System Deployment Guide

This guide provides step-by-step instructions for deploying your Bank Management System to various platforms.

## 📋 Pre-Deployment Checklist

- ✅ Server configured with environment variables
- ✅ Database setup scripts ready  
- ✅ Client build optimized
- ✅ All dependencies installed
- ✅ Code tested locally

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Easy & Free)

Railway is the easiest platform to deploy full-stack applications with PostgreSQL.

#### Step 1: Prepare Your Project
```bash
# Make sure you're in the server directory
cd server

# Install dependencies
npm install

# Test server locally
npm start
```

#### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Connect your repository
6. Railway will automatically detect it's a Node.js app

#### Step 3: Add Database
1. In Railway dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL instance

#### Step 4: Configure Environment Variables
In Railway dashboard, go to your app → Variables, add:
```
DB_HOST=your-railway-postgres-host
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your-railway-postgres-password
DB_PORT=5432
NODE_ENV=production
```

#### Step 5: Run Database Setup
1. Connect to Railway PostgreSQL using provided credentials
2. Run the setup scripts:
```sql
-- Copy content from database-setup/complete_db_setup.sql
-- Copy content from database-setup/add_customers.sql
```

### Option 2: Heroku

#### Prerequisites
- Heroku CLI installed
- Git repository initialized

#### Step 1: Setup Heroku
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-bank-management-system

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini
```

#### Step 2: Configure Environment Variables
```bash
# Get database URL
heroku config:get DATABASE_URL

# Set additional variables
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
```

#### Step 3: Deploy
```bash
# Deploy to Heroku
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Step 4: Setup Database
```bash
# Connect to Heroku PostgreSQL
heroku pg:psql

# Run setup scripts (copy-paste content from database-setup files)
```

### Option 3: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway
Follow Railway steps above for the server.

#### Deploy Frontend to Vercel
```bash
cd ../client

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
REACT_APP_API_URL=https://your-railway-backend.up.railway.app
```

## 🛠️ Local Testing Before Deployment

### Test Server
```bash
cd server
npm start
# Should show: 🚀 Server is running on port 5000
```

### Test Client
```bash
cd ../client
npm start
# Should show: React app running on localhost:3000
```

### Test Full Stack
1. Start server (port 5000)
2. Start client (port 3000)
3. Test all functionality:
   - Customer login
   - Employee/Manager login
   - Account creation
   - Transactions
   - Admin operations

## 🔧 Production Configuration

### Environment Variables (Production)
```env
# Database
DB_HOST=your-production-db-host
DB_NAME=your-production-db-name
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_PORT=5432

# Server
NODE_ENV=production
PORT=5000

# Security
DATABASE_URL=postgresql://user:pass@host:port/db
```

### Client Production Build
```bash
cd client
npm run build
```

This creates an optimized `build/` folder ready for deployment.

## 📊 Database Migration

### For Cloud Databases
1. Create database instance on your platform
2. Get connection credentials
3. Run setup scripts:

```sql
-- 1. Create tables and procedures
\i database-setup/complete_db_setup.sql

-- 2. Add sample data (optional)
\i database-setup/add_customers.sql

-- 3. Verify setup
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM branches;
```

## 🔍 Post-Deployment Verification

### Check Server Health
```bash
curl https://your-deployed-server.com/branch
# Should return JSON array of branches
```

### Check Client
1. Visit your deployed frontend URL
2. Test login functionality
3. Verify API calls work
4. Test all features

### Check Database
```sql
-- Verify all tables exist
\dt

-- Check data
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM employees;
SELECT COUNT(*) FROM branches;
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Check database credentials and ensure database is running.

#### 2. CORS Error
```
Access-Control-Allow-Origin error
```
**Solution:** Update CORS configuration in app.js:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

#### 3. Build Errors
```
Module not found
```
**Solution:** Install all dependencies:
```bash
npm install
```

#### 4. Port Issues
```
Port already in use
```
**Solution:** Ensure PORT environment variable is set correctly.

### Debug Commands

```bash
# Check environment variables
echo $DATABASE_URL

# Test database connection
node -e "const pool = require('./database'); pool.query('SELECT NOW()', (err, res) => { console.log(err ? err : res.rows[0]); pool.end(); })"

# Check server logs
heroku logs --tail  # For Heroku
railway logs        # For Railway
```

## 🔒 Security Considerations

### Production Security
1. **Environment Variables:** Never commit .env files
2. **Database:** Use strong passwords and SSL
3. **CORS:** Configure for specific domains only
4. **HTTPS:** Use SSL certificates
5. **Input Validation:** Sanitize all user inputs

### Recommended Security Headers
```javascript
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});
```

## 📈 Monitoring & Maintenance

### Health Checks
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});
```

### Logging
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

## 🎯 Performance Optimization

### Database Optimization
- Add indexes on frequently queried columns
- Use connection pooling
- Optimize queries

### Client Optimization
- Build production bundle
- Enable gzip compression
- Use CDN for static assets

---

## 🚀 Quick Deploy Commands

### Railway (Fastest)
```bash
# 1. Push to GitHub
git add . && git commit -m "Deploy" && git push

# 2. Connect Railway to repo
# 3. Add PostgreSQL service
# 4. Configure environment variables
# 5. Run database setup
```

### Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
git push heroku main
heroku pg:psql < database-setup/complete_db_setup.sql
```

**Your Bank Management System is now ready for production! 🎉**

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all environment variables
3. Check server and database logs
4. Test locally before deploying

Good luck with your deployment! 🚀