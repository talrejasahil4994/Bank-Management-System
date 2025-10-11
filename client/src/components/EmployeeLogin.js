import React, { useState } from 'react';
import employee from '../images/employee.png';
import { useHistory } from 'react-router-dom';
import Toast from './Toast';
import useToast from '../hooks/useToast';
import BackButton from './BackButton';

const EmployeeLogin = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const history = useHistory();
    const { toast, showSuccess, showError, showInfo, hideToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        showInfo('Authenticating credentials...', 2000);

        try {
            // Try manager login first
            let response = await fetch('http://localhost:5000/manager/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            let data = await response.json();

            if (response.ok && data.success) {
                // Manager login successful - redirect to employee page with manager role
                const successMessage = `Welcome Manager ${data.user.full_name || username}! Redirecting to dashboard...`;
                setMessage(successMessage);
                showSuccess(successMessage, 2000);
                setTimeout(() => {
                    history.push(`/employee?username=${username}&role=manager`);
                }, 2000);
                return;
            }

            // Try employee login if manager login failed
            response = await fetch('http://localhost:5000/employee/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            data = await response.json();

            if (response.ok && data.success) {
                // Employee login successful - redirect to employee page with employee role
                const successMessage = `Welcome ${data.user.full_name || username}! Redirecting to dashboard...`;
                setMessage(successMessage);
                showSuccess(successMessage, 2000);
                setTimeout(() => {
                    history.push(`/employee?username=${username}&role=employee`);
                }, 2000);
            } else {
                const errorMessage = 'Invalid credentials. Please check your username and password.';
                setMessage(errorMessage);
                showError(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = 'Network error occurred. Please check your connection and try again.';
            setMessage(errorMessage);
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
            <br />
            <h1 className="mt-5 mb-5" style={{ textAlign: "center" }}>Employee / Manager Login</h1>
            
            {/* Toast message */}
            {message && (
                <div className="container mb-3">
                    <div className={`alert ${message.includes('Welcome') ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                </div>
            )}
            
            <div className="border container p-0 shadow-lg p-3 mb-5 bg-white rounded" style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={employee} alt="employee" className="rounded mx-auto d-block ml-10 mr-10 flex-left p-5" height="400px" />
                
                <form className='container flex-right p-5' onSubmit={handleLogin} style={{ alignSelf: "right" }}>
                    <div className="form-group">
                        <label className="mt-4">Username</label>
                        <input 
                            type="text" 
                            className="form-control mb-3" 
                            value={username}
                            onChange={e => setUserName(e.target.value)} 
                            required 
                            disabled={loading}
                            placeholder="Enter your username"
                        />
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password}
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            disabled={loading}
                            placeholder="Enter your password"
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

export default EmployeeLogin;
