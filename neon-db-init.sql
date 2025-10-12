-- ===============================================
-- NEON DATABASE INITIALIZATION SCRIPT
-- Bank Management System
-- ===============================================

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    house_no VARCHAR(50),
    city VARCHAR(50),
    zipcode VARCHAR(10),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS emp_login (
    emp_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS manager_login (
    manager_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS branch (
    branch_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    house_no VARCHAR(50),
    city VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10),
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS accounts (
    account_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customer(customer_id) ON DELETE CASCADE,
    current_balance DECIMAL(15,2) DEFAULT 0.00,
    date_opened DATE DEFAULT CURRENT_DATE,
    account_type VARCHAR(20) DEFAULT 'SAVINGS',
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS "transaction" (
    transaction_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES branch(branch_id),
    amount DECIMAL(15,2) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('Deposit', 'Withdraw')),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by VARCHAR(100) DEFAULT 'SYSTEM'
);

-- Create stored procedures
CREATE OR REPLACE PROCEDURE insert_into_customer(
    name VARCHAR, phone VARCHAR, email VARCHAR, 
    house_no VARCHAR, city VARCHAR, zipcode VARCHAR, 
    username VARCHAR, password VARCHAR
)
LANGUAGE SQL AS
$$
INSERT INTO customer(name, phone, email, house_no, city, zipcode, username, password, created_at)
VALUES(name, phone, email, house_no, city, zipcode, username, password, CURRENT_DATE);
$$;

CREATE OR REPLACE PROCEDURE insert_into_emp_login(
    username VARCHAR, user_password VARCHAR, 
    full_name VARCHAR, email VARCHAR
)
LANGUAGE SQL AS
$$
INSERT INTO emp_login(username, user_password, full_name, email, created_at)
VALUES(username, user_password, full_name, email, CURRENT_DATE);
$$;

CREATE OR REPLACE PROCEDURE insert_into_manager(
    username VARCHAR, user_password VARCHAR, 
    full_name VARCHAR, email VARCHAR
)
LANGUAGE SQL AS
$$
INSERT INTO manager_login(username, user_password, full_name, email, created_at)
VALUES(username, user_password, full_name, email, CURRENT_DATE);
$$;

CREATE OR REPLACE PROCEDURE insert_into_branch(
    name VARCHAR, house_no VARCHAR, city VARCHAR, zip_code VARCHAR
)
LANGUAGE SQL AS
$$
INSERT INTO branch(name, house_no, city, zip_code, created_at)
VALUES(name, house_no, city, zip_code, CURRENT_DATE);
$$;

CREATE OR REPLACE PROCEDURE insert_into_accounts(
    customer_id INTEGER, current_balance DECIMAL
)
LANGUAGE SQL AS
$$
INSERT INTO accounts(customer_id, current_balance, date_opened, account_type, status)
VALUES(customer_id, current_balance, CURRENT_DATE, 'SAVINGS', 'ACTIVE');
$$;

CREATE OR REPLACE PROCEDURE insert_into_transaction(
    account_id INTEGER, branch_id INTEGER, 
    amount DECIMAL, action VARCHAR
)
LANGUAGE SQL AS
$$
BEGIN
    -- Insert transaction record
    INSERT INTO "transaction"(account_id, branch_id, amount, action, transaction_date, processed_by)
    VALUES(account_id, branch_id, amount, action, CURRENT_TIMESTAMP, 'SYSTEM');
    
    -- Update account balance
    IF action = 'Deposit' THEN
        UPDATE accounts SET current_balance = current_balance + amount WHERE account_id = account_id;
    ELSIF action = 'Withdraw' THEN
        UPDATE accounts SET current_balance = current_balance - amount WHERE account_id = account_id;
    END IF;
END;
$$;

-- Insert default manager if not exists
INSERT INTO manager_login(username, user_password, full_name, email, created_at) 
SELECT 'Rani', '12345', 'Rani Sharma', 'rani.sharma@bankmanagement.com', CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM manager_login WHERE username = 'Rani');

-- Insert sample branches if none exist
INSERT INTO branch (name, house_no, city, zip_code, created_at)
SELECT * FROM (
    VALUES 
        ('Downtown Branch', 'D123', 'New York', '10002', CURRENT_DATE),
        ('Uptown Branch', 'U456', 'New York', '10003', CURRENT_DATE),
        ('Main Street Branch', 'M789', 'Los Angeles', '90210', CURRENT_DATE)
) AS new_branches(name, house_no, city, zip_code, created_at)
WHERE NOT EXISTS (SELECT 1 FROM branch LIMIT 1);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_username ON customer(username);
CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email);
CREATE INDEX IF NOT EXISTS idx_accounts_customer ON accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_transaction_account ON "transaction"(account_id);
CREATE INDEX IF NOT EXISTS idx_emp_username ON emp_login(username);
CREATE INDEX IF NOT EXISTS idx_manager_username ON manager_login(username);

COMMIT;