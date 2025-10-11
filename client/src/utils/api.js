// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Utility function to get full API URL
export const getApiUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
    // Authentication
    CUSTOMER_LOGIN: 'customer/login',
    EMPLOYEE_LOGIN: 'employee/login',
    MANAGER_LOGIN: 'manager/login',
    
    // Customer management
    CUSTOMERS: 'customer',
    CUSTOMER_BY_ID: (id) => `customer/${id}`,
    
    // Employee management
    EMPLOYEES: 'employee',
    EMPLOYEE_BY_ID: (id) => `employee/${id}`,
    
    // Branch management
    BRANCHES: 'branch',
    BRANCH_BY_ID: (id) => `branch/${id}`,
    
    // Account management
    ACCOUNTS: 'accounts',
    ACCOUNTS_BY_CUSTOMER: (customerId) => `accounts/${customerId}`,
    ACCOUNT_BY_ID: (id) => `accounts/${id}`,
    
    // Transactions
    TRANSACTIONS: 'transaction',
    TRANSACTIONS_BY_CUSTOMER: (customerId) => `transaction/${customerId}`,
};

// Export default API base URL for direct usage
export default API_BASE_URL;