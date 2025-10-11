import React from 'react';
import { useHistory } from 'react-router-dom';
import useToast from '../hooks/useToast';

const BackButton = ({ 
    to, 
    label = 'Back', 
    className = 'btn btn-outline-light', 
    style = { position: 'fixed', top: '20px', left: '20px', zIndex: 1050 },
    showToast = true,
    toastMessage = 'Navigating back...',
    clearSession = false,
    sessionKeys = ['customerData', 'employeeData', 'userRole'],
    variant = 'light' // 'light', 'dark', 'primary', 'secondary'
}) => {
    const history = useHistory();
    const { showInfo, showSuccess } = useToast();

    const handleBackClick = () => {
        if (showToast) {
            showInfo(toastMessage, 1000);
        }

        // Determine the target URL
        const targetURL = typeof to === 'function' ? to() : to;

        // Clear session data if requested
        if (clearSession) {
            sessionKeys.forEach(key => {
                sessionStorage.removeItem(key);
            });
            
            setTimeout(() => {
                if (showToast) {
                    showSuccess('Session cleared successfully!', 1000);
                }
                setTimeout(() => {
                    history.push(targetURL);
                }, 1000);
            }, 1000);
        } else {
            setTimeout(() => {
                history.push(targetURL);
            }, showToast ? 1000 : 0);
        }
    };

    // Dynamic className based on variant
    const getButtonClass = () => {
        if (className !== 'btn btn-outline-light') {
            return className; // Use custom className if provided
        }
        
        switch (variant) {
            case 'dark':
                return 'btn btn-outline-dark';
            case 'primary':
                return 'btn btn-outline-primary';
            case 'secondary':
                return 'btn btn-outline-secondary';
            case 'success':
                return 'btn btn-outline-success';
            case 'info':
                return 'btn btn-outline-info';
            case 'warning':
                return 'btn btn-outline-warning';
            case 'danger':
                return 'btn btn-outline-danger';
            case 'light':
            default:
                return 'btn btn-outline-light';
        }
    };

    // Enhanced styling for better visibility
    const enhancedStyle = {
        ...style,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: '2px solid',
        fontWeight: '600',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
        minWidth: '100px'
    };

    return (
        <button 
            className={getButtonClass()}
            style={enhancedStyle}
            onClick={handleBackClick}
            title={`Go back to previous page`}
            onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }}
        >
            ← {label}
        </button>
    );
};

export default BackButton;