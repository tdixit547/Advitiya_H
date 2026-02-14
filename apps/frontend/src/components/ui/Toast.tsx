// ============================================
// SMART LINK HUB - Toast Notification Component
// Slide/fade notifications with auto-dismiss
// ============================================

'use client';

import { useEffect, useState, useCallback, createContext, useContext } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    // Mobile haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(type === 'error' ? [50, 50, 50] : 50);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 200);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const iconMap = {
    success: '✓',
    error: '×',
    info: 'ℹ',
  };

  const colorMap = {
    success: 'text-[#00C853]',
    error: 'text-red-400',
    info: 'text-blue-400',
  };

  return (
    <div
      className={`toast ${toast.type === 'success' ? 'toast-success' : toast.type === 'error' ? 'toast-error' : ''} ${isExiting ? 'toast-exit' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className={`text-lg font-bold ${colorMap[toast.type]}`}>
          {iconMap[toast.type]}
        </span>
        <span className="text-sm text-[#E6E6E6]">{toast.message}</span>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 200);
          }}
          className="ml-auto text-[#666] hover:text-white transition-colors p-1"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
