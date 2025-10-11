// Load environment variables
require('dotenv').config();

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
        const query = await pool.query('SELECT * FROM manager_login WHERE username=$1 AND user_password=$2',[username, password]);
        if(query.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Manager login successful', user: query.rows[0], role: 'manager' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
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
        console.log(req.body);
        const {name,phone,email,house_no,city,zipcode,username,password} = req.body;
        console.log(`${name}`)
        const query= await pool.query('call insert_into_customer($1,$2,$3,$4,$5,$6,$7,$8)',[name,phone,email,house_no,city,zipcode,username,password]);
        res.status(200).json({ success: true, message: 'Customer added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to add customer', error: err.message });
    }
});
app.delete('/customer/:customer_id',async(req,res)=>{
    try {
        const {customer_id} = req.params;
        const query = await pool.query('delete from customer where customer_id=cast($1 as integer)',[customer_id]);
        res.send(query.rows);
    } catch (error) {
        console.log(error);
    }
});

// Manager endpoints
app.post('/manager', async(req,res)=>{
    try {
        const {username, user_password, full_name, email} = req.body;
        const query = await pool.query('call insert_into_manager($1,$2,$3,$4)',[username, user_password, full_name, email]);
        res.status(200).json({ success: true, message: 'Manager added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to add manager', error: err.message });
    }
});

app.get('/manager',async(req,res)=>{
    try {
        const query = await pool.query('SELECT manager_id, username, full_name, email, created_at FROM manager_login');
        res.json(query.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to get managers' });
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
        const {username, user_password, full_name, email} = req.body;
        const query = await pool.query('call insert_into_emp_login($1,$2,$3,$4)',[username, user_password, full_name, email]);
        res.status(200).json({ success: true, message: 'Employee added successfully' });
    } catch (err) {
        console.error(err.message);
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
        const {customer_id,current_balance}=req.body;
        console.log(req.body);
        const query = await pool.query('call insert_into_accounts($1,$2)',[customer_id,current_balance]);
        res.status(200).json({ success: true, message: 'Account created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to create account', error: err.message });
    }
});
app.delete('/accounts/:account_id',async(req,res)=>{
    try {
        const {account_id} = req.params;
        const query = await pool.query('delete from accounts where account_id=cast($1 as integer)',[account_id]);
        res.send(query.rows);
    } catch (error) {
        console.log(error);
    }
});
app.get('/accounts',async(req,res)=>{
    try {
        const query = await pool.query('select * from accounts');
        res.json(query.rows);
    } catch (error) {
        console.log(error);
    }
});
app.get('/accounts/:customer_id', async(req,res)=>{
    try {
        const {customer_id}= req.params;
        const query = await pool.query('select account_id,date_opened,current_balance from accounts where customer_id=$1',[customer_id]);
        console.log(query.rows);
        res.json(query.rows);
    } catch (error) {
        console.log(error);
    }
});
app.post('/branch',async(req,res)=>{
    try {
        console.log(req.body);
        const {name,house_no,city,zip_code} = req.body;
        const query = await pool.query('call insert_into_branch($1,$2,$3,$4)',[name,house_no,city,zip_code]);
        res.status(200).json({ success: true, message: 'Branch added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to add branch', error: err.message });
    }
});
app.delete('/branch/:branch_id',async(req,res)=>{
    try {
        const {branch_id} = req.params;
        const query = await pool.query('delete from branch where branch_id=cast($1 as integer)',[branch_id]);
        res.send(query.rows);
        console.log('Deleted from branch..');
    } catch (error) {
        console.log(error);
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
        
        const query = await pool.query('call insert_into_transaction($1,$2,$3,$4)',[account_id,branch_id,amount,action]);
        res.status(200).json({ success: true, message: `${action} of ${amount} completed successfully` });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ success: false, message: 'Transaction failed', error: error.message });
    }
});

app.get('/transaction/:customer_id',async(req,res)=>{
    try {
        const {customer_id} =req.params;
        const query = await pool.query('select transaction.*,accounts.customer_id from transaction left join accounts on accounts.account_id=transaction.account_id where accounts.customer_id=cast($1 as integer)',[customer_id]);
        console.log(query.rows);
        res.send(query.rows);
    } catch (error) {
        console.log(error);
    }
});
//get

app.get('/customer',async(req,res)=>{
    try {
        const query = await pool.query('select customer_id,name,phone,email,house_no,city,zipcode,username from customer');
        res.json(query.rows);
    } catch (err) {
        console.error(err.message);
    }
});
app.get('/employee',async(req,res)=>{
    try {
        const query = await pool.query('SELECT emp_id, username, full_name, email, created_at FROM emp_login');
        res.json(query.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to get employees' });
    }
});
app.get('/branch',async(req,res)=>{
    try {
        const query = await pool.query('select * from branch');
        res.json(query.rows);
    } catch (err) {
        console.error(err.message);
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
        console.log(username);
        const query = await pool.query('select * from customer where username=$1',[username]);
        console.log(query.rows);
        res.json(query.rows[0]);

    } catch (error) {
        console.log(error);
    }
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

