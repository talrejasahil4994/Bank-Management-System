import { useState } from 'react';

const useToast = () => {
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    const showToast = (message, type = 'success', duration = 4000) => {
        setToast({
            show: true,
            message,
            type
        });

        // Auto hide if duration is specified
        if (duration > 0) {
            setTimeout(() => {
                hideToast();
            }, duration);
        }
    };

    const hideToast = () => {
        setToast({
            show: false,
            message: '',
            type: 'success'
        });
    };

    const showSuccess = (message, duration = 4000) => showToast(message, 'success', duration);
    const showError = (message, duration = 4000) => showToast(message, 'error', duration);
    const showWarning = (message, duration = 4000) => showToast(message, 'warning', duration);
    const showInfo = (message, duration = 4000) => showToast(message, 'info', duration);

    return {
        toast,
        showToast,
        hideToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};

export default useToast;