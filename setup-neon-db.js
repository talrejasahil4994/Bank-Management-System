// Setup script for Neon database
require('dotenv').config();
const fs = require('fs');
const pool = require('./database.js');

async function setupDatabase() {
    console.log('🚀 Starting Neon database setup...');
    
    try {
        // Read the SQL setup file
        const sqlScript = fs.readFileSync('./database-setup/complete_db_setup.sql', 'utf8');
        
        console.log('📖 Reading database setup script...');
        
        // Split the script into individual statements
        const statements = sqlScript
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`🔄 Executing ${statements.length} database statements...`);
        
        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
                    await pool.query(statement);
                } catch (error) {
                    // Some statements might fail if tables already exist, that's okay
                    if (error.message.includes('already exists') || error.message.includes('does not exist')) {
                        console.log(`⚠️  Statement ${i + 1} skipped (already exists or not needed)`);
                    } else {
                        console.log(`❌ Error in statement ${i + 1}:`, error.message);
                    }
                }
            }
        }
        
        console.log('✅ Database setup completed!');
        console.log('🔍 Verifying tables...');
        
        // Verify the setup by checking some tables
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log('📋 Created tables:');
        tables.rows.forEach(row => console.log(`   • ${row.table_name}`));
        
        // Check sample data
        const managerCount = await pool.query('SELECT COUNT(*) FROM manager_login');
        const employeeCount = await pool.query('SELECT COUNT(*) FROM emp_login');
        const branchCount = await pool.query('SELECT COUNT(*) FROM branch');
        
        console.log('\n📊 Sample data:');
        console.log(`   • Managers: ${managerCount.rows[0].count}`);
        console.log(`   • Employees: ${employeeCount.rows[0].count}`);
        console.log(`   • Branches: ${branchCount.rows[0].count}`);
        
        console.log('\n🎉 Neon database is ready for your Bank Management System!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

setupDatabase();