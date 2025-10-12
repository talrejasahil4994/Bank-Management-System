// Load environment variables (optional for production)
try {
    require('dotenv').config();
} catch (error) {
    console.log('dotenv not found - using system environment variables');
}

const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./database.js');

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'connected'
    });
});

// Debug endpoint to test database connection and tables
app.get('/debug/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        res.json({
            success: true,
            message: 'Database connection successful',
            current_time: result.rows[0].current_time
        });
    } catch (err) {
        console.error('Database test error:', err);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: err.message
        });
    }
});

// Debug endpoint to check table structure
app.get('/debug/tables', async (req, res) => {
    try {
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        const tableInfo = {};
        
        for (const table of tables.rows) {
            const columns = await pool.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = $1 AND table_schema = 'public'
                ORDER BY ordinal_position
            `, [table.table_name]);
            
            const count = await pool.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
            
            tableInfo[table.table_name] = {
                columns: columns.rows,
                record_count: parseInt(count.rows[0].count)
            };
        }
        
        res.json({
            success: true,
            message: 'Database structure retrieved',
            tables: tableInfo
        });
    } catch (err) {
        console.error('Database structure error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve database structure',
            error: err.message
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Bank Management System API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            customers: '/customer',
            employees: '/employee',
            managers: '/manager',
            branches: '/branch',
            accounts: '/accounts',
            transactions: '/transaction'
        }
    });
});

//POST
// Manager login endpoint
app.post('/manager/login', async(req,res)=>{
    try {
        const {username, password} = req.body;
        console.log(`Manager login attempt - Username: ${username}`);
        
        const query = await pool.query('SELECT * FROM manager_login WHERE username=$1 AND user_password=$2',[username, password]);
        console.log(`Query result: ${query.rows.length} rows found`);
        
        if(query.rows.length > 0) {
            console.log('Manager login successful');
            res.status(200).json({ success: true, message: 'Manager login successful', user: query.rows[0], role: 'manager' });
        } else {
            console.log('Invalid credentials - no matching user found');
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Manager login error:', err.message);
        console.error('Error details:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// Employee login endpoint
app.post('/employee/login', async(req,res)=>{
    try {
        const {username, password} = req.body;
        const query = await pool.query('SELECT * FROM emp_login WHERE username=$1 AND user_password=$2',[username, password]);
        if(query.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Employee login successful', user: query.rows[0], role: 'employee' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Customer login endpoint
app.post('/customer/login', async(req,res)=>{
    try {
        const {username, password} = req.body;
        const query = await pool.query('SELECT customer_id, name, phone, email, house_no, city, zipcode, username FROM customer WHERE username=$1 AND password=$2',[username, password]);
        if(query.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Customer login successful', user: query.rows[0], role: 'customer' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/customer', async(req,res)=>{
    try {
        console.log('Customer creation request:', req.body);
        const {name,phone,email,house_no,city,zipcode,username,password} = req.body;
        
        // Validate required fields
        if (!name || !email || !username || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, username and password are required' });
        }
        
        console.log(`Adding customer: ${name}`);
        
        let query;
        try {
            // Try stored procedure first
            query = await pool.query('CALL insert_into_customer($1,$2,$3,$4,$5,$6,$7,$8)',[name,phone,email,house_no,city,zipcode,username,password]);
            console.log('Customer added via stored procedure');
        } catch (procError) {
            console.log('Stored procedure failed, trying direct INSERT:', procError.message);
            
            // Fallback to direct INSERT
            query = await pool.query(
                'INSERT INTO customer (name, phone, email, house_no, city, zipcode, username, password, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE) RETURNING *',
                [name, phone, email, house_no, city, zipcode, username, password]
            );
            console.log('Customer added via direct INSERT');
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Customer added successfully',
            customer: query.rows?.[0] || { name, username }
        });
    } catch (err) {
        console.error('Customer creation error:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ success: false, message: 'Failed to add customer', error: err.message });
    }
});
app.delete('/customer/:customer_id',async(req,res)=>{
    try {
        const {customer_id} = req.params;
        const query = await pool.query('delete from customer where customer_id=cast($1 as integer) returning *',[customer_id]);
        
        if (query.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Customer deleted successfully', deleted_customer: query.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete customer', error: error.message });
    }
});

// Manager endpoints
app.post('/manager', async(req,res)=>{
    try {
        console.log('Manager creation request:', req.body);
        const {username, user_password, full_name, email} = req.body;
        
        // Validate required fields
        if (!username || !user_password || !full_name) {
            return res.status(400).json({ success: false, message: 'Username, password and full name are required' });
        }
        
        console.log(`Adding manager: ${full_name}`);
        
        let query;
        try {
            // Try stored procedure first
            query = await pool.query('CALL insert_into_manager($1,$2,$3,$4)',[username, user_password, full_name, email]);
            console.log('Manager added via stored procedure');
        } catch (procError) {
            console.log('Stored procedure failed, trying direct INSERT:', procError.message);
            
            // Fallback to direct INSERT
            query = await pool.query(
                'INSERT INTO manager_login (username, user_password, full_name, email, created_at) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *',
                [username, user_password, full_name, email]
            );
            console.log('Manager added via direct INSERT');
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Manager added successfully',
            manager: query.rows?.[0] || { username, full_name }
        });
    } catch (err) {
        console.error('Manager creation error:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ success: false, message: 'Failed to add manager', error: err.message });
    }
});

app.get('/manager',async(req,res)=>{
    try {
        const query = await pool.query('SELECT manager_id, username, full_name, email, created_at FROM manager_login');
        res.status(200).json({ success: true, managers: query.rows });
    } catch (err) {
        console.error('Get managers error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to get managers', error: err.message });
    }
});

app.delete('/manager/:manager_id', async(req,res) =>{
    try {
        const {manager_id} = req.params;
        const query = await pool.query('delete from manager_login where manager_id = $1 returning *',[manager_id]);
        res.status(200).json({ success: true, message: 'Manager deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete manager' });
    }
});

app.post('/employee', async(req,res)=>{
    try {
        console.log('Employee creation request:', req.body);
        const {username, user_password, full_name, email} = req.body;
        
        // Validate required fields
        if (!username || !user_password || !full_name) {
            return res.status(400).json({ success: false, message: 'Username, password and full name are required' });
        }
        
        console.log(`Adding employee: ${full_name}`);
        
        let query;
        try {
            // Try stored procedure first
            query = await pool.query('CALL insert_into_emp_login($1,$2,$3,$4)',[username, user_password, full_name, email]);
            console.log('Employee added via stored procedure');
        } catch (procError) {
            console.log('Stored procedure failed, trying direct INSERT:', procError.message);
            
            // Fallback to direct INSERT
            query = await pool.query(
                'INSERT INTO emp_login (username, user_password, full_name, email, created_at) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *',
                [username, user_password, full_name, email]
            );
            console.log('Employee added via direct INSERT');
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Employee added successfully',
            employee: query.rows?.[0] || { username, full_name }
        });
    } catch (err) {
        console.error('Employee creation error:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ success: false, message: 'Failed to add employee', error: err.message });
    }
});
app.delete('/employee/:username', async(req,res) =>{
    try {
        const {username} = req.params;
        console.log(username);
        const query = await pool.query('delete from emp_login where username = $1 returning *',[username]);
        res.status(200).json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete employee' });
    }
});

app.post('/accounts',async(req,res)=>{
    try {
        console.log('Account creation request:', req.body);
        const {customer_id,current_balance}=req.body;
        
        // Validate required fields
        if (!customer_id || current_balance === undefined || current_balance < 0) {
            return res.status(400).json({ success: false, message: 'Valid customer_id and current_balance (>= 0) are required' });
        }
        
        console.log(`Creating account for customer ${customer_id} with balance ${current_balance}`);
        
        let query;
        try {
            // Try stored procedure first
            query = await pool.query('CALL insert_into_accounts($1,$2)',[customer_id,current_balance]);
            console.log('Account created via stored procedure');
        } catch (procError) {
            console.log('Stored procedure failed, trying direct INSERT:', procError.message);
            
            // Fallback to direct INSERT
            query = await pool.query(
                'INSERT INTO accounts (customer_id, current_balance, date_opened, account_type, status) VALUES ($1, $2, CURRENT_DATE, $3, $4) RETURNING *',
                [customer_id, current_balance, 'SAVINGS', 'ACTIVE']
            );
            console.log('Account created via direct INSERT');
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Account created successfully',
            account: query.rows?.[0] || { customer_id, current_balance }
        });
    } catch (err) {
        console.error('Account creation error:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ success: false, message: 'Failed to create account', error: err.message });
    }
});
app.delete('/accounts/:account_id',async(req,res)=>{
    try {
        const {account_id} = req.params;
        const query = await pool.query('delete from accounts where account_id=cast($1 as integer) returning *',[account_id]);
        
        if (query.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Account deleted successfully', deleted_account: query.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Account not found' });
        }
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete account', error: error.message });
    }
});
app.get('/accounts',async(req,res)=>{
    try {
        const query = await pool.query('select * from accounts');
        res.status(200).json({ success: true, accounts: query.rows });
    } catch (error) {
        console.error('Get accounts error:', error);
        res.status(500).json({ success: false, message: 'Failed to get accounts', error: error.message });
    }
});
app.get('/accounts/:customer_id', async(req,res)=>{
    try {
        const {customer_id}= req.params;
        const query = await pool.query('select account_id,date_opened,current_balance from accounts where customer_id=$1',[customer_id]);
        console.log(`Found ${query.rows.length} accounts for customer ${customer_id}`);
        res.status(200).json({ success: true, accounts: query.rows, customer_id: parseInt(customer_id) });
    } catch (error) {
        console.error('Get customer accounts error:', error);
        res.status(500).json({ success: false, message: 'Failed to get customer accounts', error: error.message });
    }
});
app.post('/branch',async(req,res)=>{
    try {
        console.log('Branch creation request:', req.body);
        const {name,house_no,city,zip_code} = req.body;
        
        // Validate required fields
        if (!name || !city) {
            return res.status(400).json({ success: false, message: 'Branch name and city are required' });
        }
        
        console.log(`Adding branch: ${name} in ${city}`);
        
        let query;
        try {
            // Try stored procedure first
            query = await pool.query('CALL insert_into_branch($1,$2,$3,$4)',[name,house_no,city,zip_code]);
            console.log('Branch added via stored procedure');
        } catch (procError) {
            console.log('Stored procedure failed, trying direct INSERT:', procError.message);
            
            // Fallback to direct INSERT
            query = await pool.query(
                'INSERT INTO branch (name, house_no, city, zip_code, created_at) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *',
                [name, house_no, city, zip_code]
            );
            console.log('Branch added via direct INSERT');
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Branch added successfully',
            branch: query.rows?.[0] || { name, city }
        });
    } catch (err) {
        console.error('Branch creation error:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ success: false, message: 'Failed to add branch', error: err.message });
    }
});
app.delete('/branch/:branch_id',async(req,res)=>{
    try {
        const {branch_id} = req.params;
        const query = await pool.query('delete from branch where branch_id=cast($1 as integer) returning *',[branch_id]);
        
        if (query.rows.length > 0) {
            console.log('Branch deleted successfully');
            res.status(200).json({ success: true, message: 'Branch deleted successfully', deleted_branch: query.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Branch not found' });
        }
    } catch (error) {
        console.error('Delete branch error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete branch', error: error.message });
    }
});
app.post('/transaction',async(req,res)=>{
    try {
        console.log(req.body);
        const {account_id,branch_id,amount,action} = req.body;
        
        // Validate inputs
        if (!account_id || !branch_id || !amount || !action) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        if (parseFloat(amount) <= 0) {
            return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
        }
        
        if (!['Deposit', 'Withdraw'].includes(action)) {
            return res.status(400).json({ success: false, message: 'Invalid action. Must be Deposit or Withdraw' });
        }
        
        let query;
        try {
            // Try stored procedure first
            query = await pool.query('CALL insert_into_transaction($1,$2,$3,$4)',[account_id,branch_id,amount,action]);
            console.log('Transaction created via stored procedure');
        } catch (procError) {
            console.log('Stored procedure failed, trying direct INSERT:', procError.message);
            
            // Fallback to direct INSERT with account balance update
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                
                // Insert transaction record
                const transactionQuery = await client.query(
                    'INSERT INTO "transaction" (account_id, branch_id, amount, action, transaction_date, processed_by) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5) RETURNING *',
                    [account_id, branch_id, amount, action, 'SYSTEM']
                );
                
                // Update account balance
                const balanceChange = action === 'Deposit' ? parseFloat(amount) : -parseFloat(amount);
                await client.query(
                    'UPDATE accounts SET current_balance = current_balance + $1 WHERE account_id = $2',
                    [balanceChange, account_id]
                );
                
                await client.query('COMMIT');
                query = transactionQuery;
                console.log('Transaction created via direct INSERT with balance update');
            } catch (transError) {
                await client.query('ROLLBACK');
                throw transError;
            } finally {
                client.release();
            }
        }
        
        res.status(201).json({ 
            success: true, 
            message: `${action} of $${amount} completed successfully`,
            transaction: query.rows?.[0] || { account_id, branch_id, amount, action }
        });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ success: false, message: 'Transaction failed', error: error.message });
    }
});

app.get('/transaction/:customer_id',async(req,res)=>{
    try {
        const {customer_id} =req.params;
        const query = await pool.query('select transaction.*,accounts.customer_id from transaction left join accounts on accounts.account_id=transaction.account_id where accounts.customer_id=cast($1 as integer)',[customer_id]);
        console.log(`Found ${query.rows.length} transactions for customer ${customer_id}`);
        res.status(200).json({ success: true, transactions: query.rows, customer_id: parseInt(customer_id) });
    } catch (error) {
        console.error('Get customer transactions error:', error);
        res.status(500).json({ success: false, message: 'Failed to get customer transactions', error: error.message });
    }
});
//get

app.get('/customer',async(req,res)=>{
    try {
        const query = await pool.query('select customer_id,name,phone,email,house_no,city,zipcode,username from customer');
        res.status(200).json({ success: true, customers: query.rows });
    } catch (err) {
        console.error('Get customers error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to get customers', error: err.message });
    }
});
app.get('/employee',async(req,res)=>{
    try {
        const query = await pool.query('SELECT emp_id, username, full_name, email, created_at FROM emp_login');
        res.status(200).json({ success: true, employees: query.rows });
    } catch (err) {
        console.error('Get employees error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to get employees', error: err.message });
    }
});
app.get('/branch',async(req,res)=>{
    try {
        const query = await pool.query('select * from branch');
        res.status(200).json({ success: true, branches: query.rows });
    } catch (err) {
        console.error('Get branches error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to get branches', error: err.message });
    }
});

//put
// Update customer endpoint
app.put('/customer/:customer_id', async(req,res)=>{
    try {
        const {customer_id} = req.params;
        const {name, phone, email, house_no, city, zipcode} = req.body;
        
        const query = await pool.query(
            'UPDATE customer SET name=$1, phone=$2, email=$3, house_no=$4, city=$5, zipcode=$6 WHERE customer_id=$7 RETURNING *',
            [name, phone, email, house_no, city, zipcode, customer_id]
        );
        
        if (query.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Customer updated successfully', customer: query.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Customer not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to update customer', error: err.message });
    }
});

// Update employee endpoint
app.put('/employee/:emp_id', async(req,res)=>{
    try {
        const {emp_id} = req.params;
        const {username, full_name, email} = req.body;
        
        const query = await pool.query(
            'UPDATE emp_login SET username=$1, full_name=$2, email=$3 WHERE emp_id=$4 RETURNING emp_id, username, full_name, email, created_at',
            [username, full_name, email, emp_id]
        );
        
        if (query.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Employee updated successfully', employee: query.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Employee not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to update employee', error: err.message });
    }
});

// Update branch endpoint
app.put('/branch/:branch_id', async(req,res)=>{
    try {
        const {branch_id} = req.params;
        const {name, house_no, city, zip_code} = req.body;
        
        const query = await pool.query(
            'UPDATE branch SET name=$1, house_no=$2, city=$3, zip_code=$4 WHERE branch_id=$5 RETURNING *',
            [name, house_no, city, zip_code, branch_id]
        );
        
        if (query.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Branch updated successfully', branch: query.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Branch not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to update branch', error: err.message });
    }
});
app.get('/customer/:username',async(req,res)=>{
    try {
        const username = req.params.username;
        console.log(`Looking for customer with username: ${username}`);
        const query = await pool.query('select * from customer where username=$1',[username]);
        
        if (query.rows.length > 0) {
            console.log('Customer found');
            res.status(200).json({ success: true, customer: query.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Get customer by username error:', error);
        res.status(500).json({ success: false, message: 'Failed to get customer', error: error.message });
    }
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

