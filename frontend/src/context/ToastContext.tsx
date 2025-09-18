import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '../types/toast';

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts(current => [...current, newToast]);

    // Auto-hide toast after duration
    setTimeout(() => {
      hideToast(id);
    }, newToast.duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    const toastData: Omit<Toast, 'id'> = { type: 'success', title };
    if (message) toastData.message = message;
    showToast(toastData);
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    const toastData: Omit<Toast, 'id'> = { type: 'error', title, duration: 7000 };
    if (message) toastData.message = message;
    showToast(toastData);
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    const toastData: Omit<Toast, 'id'> = { type: 'warning', title };
    if (message) toastData.message = message;
    showToast(toastData);
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    const toastData: Omit<Toast, 'id'> = { type: 'info', title };
    if (message) toastData.message = message;
    showToast(toastData);
  }, [showToast]);

  const value: ToastContextType = {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};