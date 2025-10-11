import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import customer from '../images/customer.png';
import Toast from './Toast';
import useToast from '../hooks/useToast';
import BackButton from './BackButton';
import { getApiUrl, API_ENDPOINTS } from '../utils/api';

const CustomerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();
    const { toast, showSuccess, showError, showInfo, hideToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        showInfo('Logging in, please wait...', 2000);

        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.CUSTOMER_LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Store customer data in sessionStorage
                sessionStorage.setItem('customerData', JSON.stringify(data.user));
                sessionStorage.setItem('userRole', 'customer');
                
                // Show success toast
                showSuccess(`Welcome back, ${data.user.name}! Redirecting to dashboard...`, 2000);
                
                // Redirect to customer dashboard after a short delay
                setTimeout(() => {
                    history.push('/customer');
                }, 2000);
            } else {
                setError(data.message || 'Invalid credentials');
                showError(data.message || 'Invalid credentials. Please check your username and password.');
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = 'Network error occurred. Please check your connection and try again.';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
<div>
    <BackButton 
        to="/" 
        label="Home" 
        toastMessage="Returning to home page..."
        variant="secondary"
    />
    <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={hideToast} 
    />
    <br></br>
<h1 className="mt-5 mb-5" style={{textAlign : "center"}}>Customer Login</h1>
<div className="border container p-0 shadow-lg p-3 mb-5 bg-white rounded "  style={{display: 'flex',  justifyContent:'center'}}>
    <img src={customer} alt="customer missing" className="rounded mx-auto d-block ml-10 mr-10 flex-left p-5" height="400px"></img>
    <form className='container flex-right p-5 ' style={{alignSelf : "right"}} onSubmit={handleLogin}>
        {error && (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        )}
        
        <div className="form-group">
            <label className="mt-4">Username</label>
            <input 
                type="text" 
                className="form-control mb-3" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
            />
            <label>Password</label>
            <input 
                type="password" 
                className="form-control" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
            />
        </div>

        <button 
            type="submit" 
            className="btn btn-primary btn-lg mt-3"
            disabled={loading}
        >
            {loading ? 'Logging in...' : 'Login'}
        </button>
    </form>
</div>
</div>
    );
};

export default CustomerLogin;