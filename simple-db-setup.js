// Simple database setup for Neon
require('dotenv').config();
const pool = require('./database.js');

async function setupDatabase() {
    console.log('🚀 Setting up Bank Management System database...');
    
    try {
        // Create tables step by step
        console.log('📝 Creating tables...');
        
        // 1. Create manager_login table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS manager_login (
                manager_id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                user_password VARCHAR(100) NOT NULL,
                full_name VARCHAR(100),
                email VARCHAR(100),
                created_at DATE DEFAULT CURRENT_DATE
            )
        `);
        console.log('✅ manager_login table created');

        // 2. Create emp_login table  
        await pool.query(`
            CREATE TABLE IF NOT EXISTS emp_login (
                emp_id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                user_password VARCHAR(100) NOT NULL,
                full_name VARCHAR(100),
                email VARCHAR(100),
                created_at DATE DEFAULT CURRENT_DATE
            )
        `);
        console.log('✅ emp_login table created');

        // 3. Create customer table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS customer (
                customer_id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(100),
                house_no VARCHAR(50),
                city VARCHAR(50),
                zipcode VARCHAR(10),
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                created_at DATE DEFAULT CURRENT_DATE
            )
        `);
        console.log('✅ customer table created');

        // 4. Create branch table with sequence
        await pool.query(`CREATE SEQUENCE IF NOT EXISTS b_id_sequence START 1`);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS branch (
                branch_id INTEGER PRIMARY KEY DEFAULT NEXTVAL('b_id_sequence'),
                name VARCHAR(100) NOT NULL,
                house_no VARCHAR(50),
                city VARCHAR(50),
                zip_code VARCHAR(10),
                created_at DATE DEFAULT CURRENT_DATE
            )
        `);
        console.log('✅ branch table created');

        // 5. Create accounts table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS accounts (
                account_id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES customer(customer_id) ON DELETE CASCADE,
                date_opened DATE DEFAULT CURRENT_DATE,
                current_balance DECIMAL(12,2) DEFAULT 0.00,
                account_type VARCHAR(20) DEFAULT 'SAVINGS',
                status VARCHAR(20) DEFAULT 'ACTIVE'
            )
        `);
        console.log('✅ accounts table created');

        // 6. Create transaction table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "transaction" (
                transaction_id SERIAL PRIMARY KEY,
                account_id INTEGER REFERENCES accounts(account_id) ON DELETE CASCADE,
                branch_id INTEGER REFERENCES branch(branch_id),
                amount DECIMAL(12,2) NOT NULL,
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                action VARCHAR(20) NOT NULL CHECK (action IN ('Deposit', 'Withdraw')),
                processed_by VARCHAR(100)
            )
        `);
        console.log('✅ transaction table created');

        // Create stored procedures
        console.log('🔧 Creating stored procedures...');

        await pool.query(`
            CREATE OR REPLACE FUNCTION insert_into_customer(
                p_name VARCHAR, p_phone VARCHAR, p_email VARCHAR, 
                p_house_no VARCHAR, p_city VARCHAR, p_zipcode VARCHAR, 
                p_username VARCHAR, p_password VARCHAR
            ) RETURNS VOID AS $$
            BEGIN
                INSERT INTO customer(name, phone, email, house_no, city, zipcode, username, password)
                VALUES(p_name, p_phone, p_email, p_house_no, p_city, p_zipcode, p_username, p_password);
            END;
            $$ LANGUAGE plpgsql;
        `);

        await pool.query(`
            CREATE OR REPLACE FUNCTION insert_into_manager(
                p_username VARCHAR, p_password VARCHAR, p_full_name VARCHAR, p_email VARCHAR
            ) RETURNS VOID AS $$
            BEGIN
                INSERT INTO manager_login(username, user_password, full_name, email)
                VALUES(p_username, p_password, p_full_name, p_email);
            END;
            $$ LANGUAGE plpgsql;
        `);

        await pool.query(`
            CREATE OR REPLACE FUNCTION insert_into_emp_login(
                p_username VARCHAR, p_password VARCHAR, p_full_name VARCHAR, p_email VARCHAR
            ) RETURNS VOID AS $$
            BEGIN
                INSERT INTO emp_login(username, user_password, full_name, email)
                VALUES(p_username, p_password, p_full_name, p_email);
            END;
            $$ LANGUAGE plpgsql;
        `);

        await pool.query(`
            CREATE OR REPLACE FUNCTION insert_into_branch(
                p_name VARCHAR, p_house_no VARCHAR, p_city VARCHAR, p_zip_code VARCHAR
            ) RETURNS VOID AS $$
            BEGIN
                INSERT INTO branch(name, house_no, city, zip_code)
                VALUES(p_name, p_house_no, p_city, p_zip_code);
            END;
            $$ LANGUAGE plpgsql;
        `);

        await pool.query(`
            CREATE OR REPLACE FUNCTION insert_into_accounts(
                p_customer_id INTEGER, p_current_balance DECIMAL
            ) RETURNS VOID AS $$
            BEGIN
                INSERT INTO accounts(customer_id, current_balance)
                VALUES(p_customer_id, p_current_balance);
            END;
            $$ LANGUAGE plpgsql;
        `);

        await pool.query(`
            CREATE OR REPLACE FUNCTION insert_into_transaction(
                p_account_id INTEGER, p_branch_id INTEGER, p_amount DECIMAL, p_action VARCHAR
            ) RETURNS VOID AS $$
            BEGIN
                INSERT INTO "transaction"(account_id, branch_id, amount, action)
                VALUES(p_account_id, p_branch_id, p_amount, p_action);
                
                -- Update account balance
                IF p_action = 'Deposit' THEN
                    UPDATE accounts SET current_balance = current_balance + p_amount WHERE account_id = p_account_id;
                ELSIF p_action = 'Withdraw' THEN
                    UPDATE accounts SET current_balance = current_balance - p_amount WHERE account_id = p_account_id;
                END IF;
            END;
            $$ LANGUAGE plpgsql;
        `);
        console.log('✅ Stored procedures created');

        // Insert sample data
        console.log('📊 Inserting sample data...');

        // Insert managers
        await pool.query(`
            INSERT INTO manager_login(username, user_password, full_name, email) VALUES
            ('Rani', '12345', 'Rani Sharma', 'rani.sharma@bankmanagement.com'),
            ('admin', 'admin12345', 'Admin Manager', 'admin@bankmanagement.com')
            ON CONFLICT (username) DO NOTHING
        `);

        // Insert employees
        await pool.query(`
            INSERT INTO emp_login(username, user_password, full_name, email) VALUES
            ('john.doe', 'emp123', 'John Doe', 'john.doe@bank.com'),
            ('sarah.smith', 'emp124', 'Sarah Smith', 'sarah.smith@bank.com'),
            ('mike.johnson', 'emp125', 'Mike Johnson', 'mike.johnson@bank.com')
            ON CONFLICT (username) DO NOTHING
        `);

        // Insert branches
        await pool.query(`
            INSERT INTO branch (name, house_no, city, zip_code) VALUES
            ('Downtown Branch', 'D123', 'New York', '10002'),
            ('Uptown Branch', 'U456', 'New York', '10003')
            ON CONFLICT DO NOTHING
        `);

        console.log('✅ Sample data inserted');

        // Verify setup
        const tables = await pool.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' ORDER BY table_name
        `);
        
        console.log('📋 Created tables:');
        tables.rows.forEach(row => console.log(`   • ${row.table_name}`));

        const managerCount = await pool.query('SELECT COUNT(*) FROM manager_login');
        const employeeCount = await pool.query('SELECT COUNT(*) FROM emp_login');
        const branchCount = await pool.query('SELECT COUNT(*) FROM branch');

        console.log('\n📊 Sample data counts:');
        console.log(`   • Managers: ${managerCount.rows[0].count}`);
        console.log(`   • Employees: ${employeeCount.rows[0].count}`);
        console.log(`   • Branches: ${branchCount.rows[0].count}`);

        console.log('\n🎉 Database setup completed successfully!');
        console.log('🔐 Login credentials:');
        console.log('   Manager: username="admin", password="admin12345"');
        console.log('   Manager: username="Rani", password="12345"');
        console.log('   Employee: username="john.doe", password="emp123"');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

setupDatabase();