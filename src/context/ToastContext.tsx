import React, { createContext, useContext, useState, useCallback } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message = '') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const success = useCallback((title: string, message = '') => showToast('success', title, message), [showToast]);
  const error = useCallback((title: string, message = '') => showToast('error', title, message), [showToast]);
  const warning = useCallback((title: string, message = '') => showToast('warning', title, message), [showToast]);
  const info = useCallback((title: string, message = '') => showToast('info', title, message), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast Container Top-Right */}
      <div 
        id="salonglitt-toast-container" 
        className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      >
        {toasts.map(toast => {
          let borderColor = 'border-[#70D6FF]';
          let bgColor = 'bg-[#1E1332]';
          let icon = <Info className="w-5 h-5 text-[#70D6FF]" />;

          if (toast.type === 'success') {
            borderColor = 'border-[#38E54D]';
            icon = <CheckCircle2 className="w-5 h-5 text-[#38E54D]" />;
          } else if (toast.type === 'error') {
            borderColor = 'border-[#FF4B4B]';
            icon = <AlertCircle className="w-5 h-5 text-[#FF4B4B]" />;
          } else if (toast.type === 'warning') {
            borderColor = 'border-[#FFB800]';
            icon = <AlertTriangle className="w-5 h-5 text-[#FFB800]" />;
          }

          return (
            <div
              key={toast.id}
              id={`toast-item-${toast.id}`}
              className={`pointer-events-auto p-4 rounded-[20px] border ${borderColor} ${bgColor} shadow-[0_10px_30px_rgba(255,112,166,0.3)] backdrop-blur-md flex items-start gap-3 transform transition-all duration-300 animate-in fade-in slide-in-from-top-4`}
            >
              <div className="mt-0.5 shrink-0 flex items-center justify-center p-1.5 rounded-full bg-white/5">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#FF70A6] font-bold">✦</span>
                  <h4 className="font-heading font-semibold text-sm text-white">{toast.title}</h4>
                </div>
                {toast.message && (
                  <p className="text-xs text-[#C8B6E2] mt-1 leading-relaxed break-words">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#C8B6E2] hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
