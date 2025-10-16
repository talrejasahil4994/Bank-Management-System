// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Debug logging for API configuration
console.log('API Configuration:', {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    API_BASE_URL: API_BASE_URL,
    origin: window.location.origin
});

// Utility function to get full API URL
export const getApiUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const fullUrl = `${API_BASE_URL}/${cleanEndpoint}`;
    console.log(`API Request URL: ${fullUrl}`);
    return fullUrl;
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

// Helper function for making API requests with proper error handling
export const makeApiRequest = async (endpoint, options = {}) => {
    const url = getApiUrl(endpoint);
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    console.log(`Making ${defaultOptions.method || 'GET'} request to:`, url);
    console.log('Request options:', defaultOptions);
    
    try {
        const response = await fetch(url, defaultOptions);
        
        console.log(`Response status: ${response.status}`);
        console.log(`Response ok: ${response.ok}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error Response:`, errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error(`API Request failed for ${url}:`, error);
        throw error;
    }
};

// Export default API base URL for direct usage
export default API_BASE_URL;
