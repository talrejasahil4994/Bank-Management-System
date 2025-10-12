const Pool = require('pg').Pool;

// Environment-based configuration
// Prioritize DATABASE_URL for cloud deployments (Neon, Heroku, etc.)
let config;

if (process.env.DATABASE_URL) {
    // Use DATABASE_URL if available (Neon/cloud deployment)
    config = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };
    console.log('Using DATABASE_URL for connection');
} else {
    // Fallback to individual environment variables
    config = {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'sahilboy9565',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5433,
        database: process.env.DB_NAME || 'BANK',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
    console.log('Using individual DB environment variables');
}

const pool = new Pool({
    ...config,
    // Connection pool settings
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Connection error handling
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Log connection details
if (process.env.DATABASE_URL) {
    console.log('Database connected using DATABASE_URL');
} else {
    console.log(`Database connected to: ${process.env.DB_NAME || 'BANK'} on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5433}`);
}

module.exports = pool;
