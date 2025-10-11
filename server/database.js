const Pool = require('pg').Pool;

// Environment-based configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'sahilboy9565',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    database: process.env.DB_NAME || 'BANK',
    // SSL configuration for production
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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

console.log(`Database connected to: ${process.env.DB_NAME || 'BANK'} on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5433}`);

module.exports = pool;
