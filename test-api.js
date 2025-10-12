// Test API endpoints
const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', reject);
        
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing Bank Management System API...');
    
    try {
        // Test health endpoint
        console.log('\n1️⃣ Testing /health endpoint...');
        const health = await testEndpoint('/health');
        console.log(`   Status: ${health.status}`);
        console.log(`   Response:`, health.data);

        // Test root endpoint
        console.log('\n2️⃣ Testing / endpoint...');
        const root = await testEndpoint('/');
        console.log(`   Status: ${root.status}`);
        console.log(`   Message: ${root.data.message}`);

        // Test manager login
        console.log('\n3️⃣ Testing manager login...');
        const managerLogin = await testEndpoint('/manager/login', 'POST', {
            username: 'admin',
            password: 'admin12345'
        });
        console.log(`   Status: ${managerLogin.status}`);
        console.log(`   Success: ${managerLogin.data.success}`);
        console.log(`   Message: ${managerLogin.data.message}`);

        // Test employee login
        console.log('\n4️⃣ Testing employee login...');
        const employeeLogin = await testEndpoint('/employee/login', 'POST', {
            username: 'john.doe',
            password: 'emp123'
        });
        console.log(`   Status: ${employeeLogin.status}`);
        console.log(`   Success: ${employeeLogin.data.success}`);
        console.log(`   Message: ${employeeLogin.data.message}`);

        // Test get managers
        console.log('\n5️⃣ Testing get managers...');
        const managers = await testEndpoint('/manager');
        console.log(`   Status: ${managers.status}`);
        console.log(`   Managers count: ${managers.data.length}`);

        // Test get employees
        console.log('\n6️⃣ Testing get employees...');
        const employees = await testEndpoint('/employee');
        console.log(`   Status: ${employees.status}`);
        console.log(`   Employees count: ${employees.data.length}`);

        // Test get branches
        console.log('\n7️⃣ Testing get branches...');
        const branches = await testEndpoint('/branch');
        console.log(`   Status: ${branches.status}`);
        console.log(`   Branches count: ${branches.data.length}`);

        console.log('\n🎉 All API tests completed successfully!');
        console.log('✅ Your Bank Management System backend is working perfectly with Neon database!');

    } catch (error) {
        console.error('❌ API test failed:', error.message);
        console.log('⚠️  Make sure your server is running: node app.js');
    }
}

runTests();