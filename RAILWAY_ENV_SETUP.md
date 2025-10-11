# Railway Environment Variables Setup

## Required Environment Variables for Railway

After creating your PostgreSQL database on Railway, you'll get connection details. Set these environment variables in your Railway app:

### Database Configuration
```
DB_HOST=<your-railway-postgres-host>
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<your-railway-postgres-password>
DB_PORT=5432
```

### Server Configuration
```
NODE_ENV=production
PORT=$PORT
```

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your app service (not the database)
3. Go to the **"Variables"** tab
4. Add each variable listed above

## Important Notes

- Railway automatically provides `$PORT` - don't override it
- The database name is usually `railway` by default
- Copy the exact host, password, and other details from your Railway PostgreSQL service
- Make sure `NODE_ENV=production` for proper configuration

## Database Setup

After deployment, you'll need to run your database setup scripts:
1. Connect to your Railway PostgreSQL using the provided credentials
2. Run the scripts from `database-setup/` directory
3. You can use Railway's built-in database console or connect via pgAdmin/DBeaver

## Next Steps

1. Deploy backend to Railway
2. Set up environment variables
3. Run database setup scripts
4. Test API endpoints
5. Deploy frontend and connect to this backend