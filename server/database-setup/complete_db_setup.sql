-- ===============================================
-- BANK MANAGEMENT SYSTEM - COMPLETE DATABASE SETUP
-- ===============================================

-- First, let's create the bank manager table and update existing structure
CREATE TABLE IF NOT EXISTS manager_login (
    manager_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at DATE DEFAULT CURRENT_DATE
);

-- Update employee table to include additional fields
ALTER TABLE emp_login ADD COLUMN IF NOT EXISTS emp_id SERIAL;
ALTER TABLE emp_login ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);
ALTER TABLE emp_login ADD COLUMN IF NOT EXISTS email VARCHAR(100);
ALTER TABLE emp_login ADD COLUMN IF NOT EXISTS created_at DATE DEFAULT CURRENT_DATE;

-- Add created_at to customer table if not exists
ALTER TABLE customer ADD COLUMN IF NOT EXISTS created_at DATE DEFAULT CURRENT_DATE;

-- Add created_at to branch table if not exists  
ALTER TABLE branch ADD COLUMN IF NOT EXISTS created_at DATE DEFAULT CURRENT_DATE;

-- Add additional fields to accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'SAVINGS';
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE';

-- Add processed_by field to transaction table
ALTER TABLE "transaction" ADD COLUMN IF NOT EXISTS processed_by VARCHAR(100);

-- ===============================================
-- STORED PROCEDURES FOR MANAGERS
-- ===============================================

-- Insert Manager
CREATE OR REPLACE PROCEDURE insert_into_manager(un VARCHAR, up VARCHAR, fn VARCHAR, em VARCHAR)
LANGUAGE SQL AS
$$
INSERT INTO manager_login(username, user_password, full_name, email)
VALUES(un, up, fn, em);
$$;

-- Update Employee procedure to include additional fields
CREATE OR REPLACE PROCEDURE insert_into_emp_login(un VARCHAR, up VARCHAR, fn VARCHAR, em VARCHAR)
LANGUAGE SQL AS
$$
INSERT INTO emp_login(username, user_password, full_name, email)
VALUES(un, up, fn, em);
$$;

-- ===============================================
-- INSERT BANK MANAGERS
-- ===============================================

-- Clear existing managers and insert the specified ones
DELETE FROM manager_login WHERE username IN ('Rani', 'admin');
INSERT INTO manager_login(username, user_password, full_name, email) VALUES
('Rani', '12345', 'Rani Sharma', 'rani.sharma@bankmanagement.com'),
('admin', 'admin12345', 'Admin Manager', 'admin@bankmanagement.com');

-- ===============================================
-- CLEAR AND INSERT EMPLOYEES (20 employees)
-- ===============================================

-- Remove the managers from employee table if they exist
DELETE FROM emp_login WHERE username IN ('Rani', 'admin');

-- Insert 20 realistic employees
INSERT INTO emp_login(username, user_password, full_name, email) VALUES
('john.doe', 'emp123', 'John Doe', 'john.doe@bank.com'),
('sarah.smith', 'emp124', 'Sarah Smith', 'sarah.smith@bank.com'),
('mike.johnson', 'emp125', 'Mike Johnson', 'mike.johnson@bank.com'),
('lisa.brown', 'emp126', 'Lisa Brown', 'lisa.brown@bank.com'),
('david.wilson', 'emp127', 'David Wilson', 'david.wilson@bank.com'),
('emily.davis', 'emp128', 'Emily Davis', 'emily.davis@bank.com'),
('chris.miller', 'emp129', 'Chris Miller', 'chris.miller@bank.com'),
('amanda.garcia', 'emp130', 'Amanda Garcia', 'amanda.garcia@bank.com'),
('james.martinez', 'emp131', 'James Martinez', 'james.martinez@bank.com'),
('jessica.lopez', 'emp132', 'Jessica Lopez', 'jessica.lopez@bank.com'),
('robert.taylor', 'emp133', 'Robert Taylor', 'robert.taylor@bank.com'),
('michelle.anderson', 'emp134', 'Michelle Anderson', 'michelle.anderson@bank.com'),
('kevin.thomas', 'emp135', 'Kevin Thomas', 'kevin.thomas@bank.com'),
('rachel.jackson', 'emp136', 'Rachel Jackson', 'rachel.jackson@bank.com'),
('daniel.white', 'emp137', 'Daniel White', 'daniel.white@bank.com'),
('lauren.harris', 'emp138', 'Lauren Harris', 'lauren.harris@bank.com'),
('mark.clark', 'emp139', 'Mark Clark', 'mark.clark@bank.com'),
('stephanie.lewis', 'emp140', 'Stephanie Lewis', 'stephanie.lewis@bank.com'),
('andrew.walker', 'emp141', 'Andrew Walker', 'andrew.walker@bank.com'),
('nicole.hall', 'emp142', 'Nicole Hall', 'nicole.hall@bank.com');

-- ===============================================
-- ADD MORE BRANCHES
-- ===============================================

-- Add more realistic branches
INSERT INTO branch (branch_id, name, house_no, city, zip_code, created_at) VALUES
(NEXTVAL('b_id_sequence'), 'Downtown Branch', 'D123', 'New York', '10002', CURRENT_DATE),
(NEXTVAL('b_id_sequence'), 'Uptown Branch', 'U456', 'New York', '10003', CURRENT_DATE),
(NEXTVAL('b_id_sequence'), 'Brooklyn Branch', 'B789', 'Brooklyn', '11201', CURRENT_DATE),
(NEXTVAL('b_id_sequence'), 'Queens Branch', 'Q321', 'Queens', '11101', CURRENT_DATE)
ON CONFLICT (branch_id) DO NOTHING;