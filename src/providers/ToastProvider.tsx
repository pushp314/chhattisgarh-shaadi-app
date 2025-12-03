/**
 * Toast Provider
 * Global toast notification provider using React Context
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType } from '../components/common/Toast';

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toastConfig, setToastConfig] = useState<{
        message: string;
        type: ToastType;
        visible: boolean;
        duration: number;
    }>({
        message: '',
        type: 'info',
        visible: false,
        duration: 3000,
    });

    const showToast = useCallback(
        (message: string, type: ToastType = 'info', duration: number = 3000) => {
            setToastConfig({
                message,
                type,
                visible: true,
                duration,
            });
        },
        []
    );

    const hideToast = useCallback(() => {
        setToastConfig(prev => ({ ...prev, visible: false }));
    }, []);

    const success = useCallback((message: string, duration: number = 3000) => {
        showToast(message, 'success', duration);
    }, [showToast]);

    const error = useCallback((message: string, duration: number = 3000) => {
        showToast(message, 'error', duration);
    }, [showToast]);

    const info = useCallback((message: string, duration: number = 3000) => {
        showToast(message, 'info', duration);
    }, [showToast]);

    const warning = useCallback((message: string, duration: number = 3000) => {
        showToast(message, 'warning', duration);
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}
            <Toast
                message={toastConfig.message}
                type={toastConfig.type}
                visible={toastConfig.visible}
                onHide={hideToast}
                duration={toastConfig.duration}
            />
        </ToastContext.Provider>
    );
};
