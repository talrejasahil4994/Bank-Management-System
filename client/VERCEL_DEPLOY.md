# 🚀 Deploy Frontend to Vercel

This guide will help you deploy your Bank Management System frontend to Vercel.

## 📋 Prerequisites

- Your backend deployed on Railway (or have the backend URL ready)
- GitHub repository: `talrejasahil4994/Bank-Management-System`
- Vercel account

## 🌐 Step-by-Step Deployment

### Step 1: Go to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository

1. In Vercel dashboard, click **"New Project"**
2. Find and select `talrejasahil4994/Bank-Management-System`
3. Click **"Import"**

### Step 3: Configure Deployment Settings

#### Framework Preset
- Vercel should auto-detect **"Create React App"**
- If not, select it manually

#### Root Directory
- Set **Root Directory** to: `client`
- This tells Vercel where your React app is located

#### Build and Output Settings
- **Build Command**: `npm run build` (should be auto-detected)
- **Output Directory**: `build` (should be auto-detected)  
- **Install Command**: `npm install` (should be auto-detected)

### Step 4: Environment Variables

Add these environment variables in Vercel:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | Your Railway backend URL |

**Example:**
- `REACT_APP_API_URL` = `https://your-backend-name.up.railway.app`

#### How to Add Environment Variables:
1. In the project configuration, scroll to **"Environment Variables"**
2. Add `REACT_APP_API_URL`
3. Enter your Railway backend URL (you'll get this after deploying backend)
4. Select **"Production"**, **"Preview"**, and **"Development"**
5. Click **"Add"**

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your app
3. Wait for deployment to complete (usually 2-3 minutes)
4. You'll get a live URL like: `https://your-app.vercel.app`

## 🔧 Backend Setup on Railway

While Vercel deploys, set up your backend:

### Deploy Backend to Railway:

1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Select `talrejasahil4994/Bank-Management-System`
5. Railway will auto-detect Node.js and deploy from `server/` directory

### Add PostgreSQL Database:
1. In Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway creates database automatically

### Configure Backend Environment Variables:
```env
DB_HOST=your-railway-postgres-host
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your-railway-postgres-password
DB_PORT=5432
NODE_ENV=production
PORT=8080
```

### Setup Database Schema:
1. Connect to Railway PostgreSQL
2. Run `server/database-setup/complete_db_setup.sql`
3. Run `server/database-setup/add_customers.sql`

## 🔄 Update Frontend with Backend URL

Once Railway gives you the backend URL:

1. Go back to Vercel project settings
2. Update `REACT_APP_API_URL` environment variable
3. Redeploy (or it will auto-redeploy)

## ✅ Verification Checklist

### Frontend (Vercel):
- [ ] Site loads correctly
- [ ] All pages render properly
- [ ] No console errors
- [ ] Responsive design works

### Backend Integration:
- [ ] Login forms connect to backend
- [ ] API calls work (check browser network tab)
- [ ] Database operations function
- [ ] Toast notifications appear

### Full Application:
- [ ] Customer login works
- [ ] Employee/Manager login works
- [ ] Account creation works
- [ ] Transactions display
- [ ] Back button navigation works
- [ ] Mobile responsiveness

## 🐛 Common Issues & Solutions

### Issue 1: API Calls Failing
**Problem**: Frontend can't connect to backend
**Solution**: Check `REACT_APP_API_URL` is correct and backend is running

### Issue 2: CORS Errors
**Problem**: Cross-origin request blocked
**Solution**: Update backend CORS configuration to allow Vercel domain

### Issue 3: Build Fails
**Problem**: Build process fails on Vercel
**Solution**: Check build logs, ensure all dependencies in package.json

### Issue 4: Environment Variables Not Working
**Problem**: API URL not updating
**Solution**: Make sure variable name starts with `REACT_APP_`

## 📱 Production URLs

After deployment, you'll have:

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-backend-name.up.railway.app`
- **Database**: Railway PostgreSQL (internal)

## 🚀 Quick Deploy Commands

If you want to use Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from client directory
cd client
vercel

# Add environment variables via CLI
vercel env add REACT_APP_API_URL
```

## 🔄 Continuous Deployment

Both platforms offer automatic deployment:
- **Vercel**: Auto-deploys on every push to main branch
- **Railway**: Auto-deploys on every push to main branch

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Check Railway deployment logs  
3. Verify environment variables
4. Test API endpoints directly

---

**Your Bank Management System will be live at:**
🌐 **https://your-app.vercel.app**

Good luck! 🚀