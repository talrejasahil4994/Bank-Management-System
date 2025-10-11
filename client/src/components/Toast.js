import React from 'react';

const Toast = ({ show, message, type = 'success', onClose, position = 'top-right', autoHide = true, duration = 4000 }) => {
    React.useEffect(() => {
        if (show && autoHide) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, autoHide, duration, onClose]);

    if (!show) return null;

    const getToastClass = () => {
        const baseClass = 'alert alert-dismissible fade show';
        switch (type) {
            case 'success':
                return `${baseClass} alert-success`;
            case 'error':
            case 'danger':
                return `${baseClass} alert-danger`;
            case 'warning':
                return `${baseClass} alert-warning`;
            case 'info':
                return `${baseClass} alert-info`;
            default:
                return `${baseClass} alert-success`;
        }
    };

    const getPositionStyle = () => {
        const baseStyle = {
            position: 'fixed',
            zIndex: 1050,
            minWidth: '300px',
            maxWidth: '500px'
        };

        switch (position) {
            case 'top-right':
                return { ...baseStyle, top: '20px', right: '20px' };
            case 'top-left':
                return { ...baseStyle, top: '20px', left: '20px' };
            case 'top-center':
                return { ...baseStyle, top: '20px', left: '50%', transform: 'translateX(-50%)' };
            case 'bottom-right':
                return { ...baseStyle, bottom: '20px', right: '20px' };
            case 'bottom-left':
                return { ...baseStyle, bottom: '20px', left: '20px' };
            case 'bottom-center':
                return { ...baseStyle, bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
            default:
                return { ...baseStyle, top: '20px', right: '20px' };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
            case 'danger':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '✅';
        }
    };

    return (
        <div style={getPositionStyle()}>
            <div className={getToastClass()} role="alert">
                <strong>{getIcon()} </strong>
                {message}
                <button 
                    type="button" 
                    className="close" 
                    onClick={onClose}
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    );
};

export default Toast;