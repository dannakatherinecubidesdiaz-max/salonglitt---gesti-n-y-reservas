import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

interface AlertBannerProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  ruleCode?: 'BR-01' | 'BR-02' | 'BR-03' | string;
  onClose?: () => void;
  id?: string;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'error',
  title,
  message,
  ruleCode,
  onClose,
  id,
  className = '',
}) => {
  const styles = {
    error: {
      bg: 'bg-[#FF4B4B]/15',
      border: 'border-[#FF4B4B]',
      glow: 'shadow-[0_0_20px_rgba(255,75,75,0.25)]',
      text: 'text-[#FF4B4B]',
      icon: <AlertCircle className="w-5 h-5 text-[#FF4B4B]" />,
      defaultTitle: 'Alerta de Regla de Negocio',
    },
    warning: {
      bg: 'bg-[#FFB800]/15',
      border: 'border-[#FFB800]',
      glow: 'shadow-[0_0_20px_rgba(255,184,0,0.25)]',
      text: 'text-[#FFB800]',
      icon: <AlertTriangle className="w-5 h-5 text-[#FFB800]" />,
      defaultTitle: 'Aviso Preventivo',
    },
    info: {
      bg: 'bg-[#70D6FF]/15',
      border: 'border-[#70D6FF]',
      glow: 'shadow-[0_0_20px_rgba(112,214,255,0.25)]',
      text: 'text-[#70D6FF]',
      icon: <Info className="w-5 h-5 text-[#70D6FF]" />,
      defaultTitle: 'Información del Sistema',
    },
    success: {
      bg: 'bg-[#38E54D]/15',
      border: 'border-[#38E54D]',
      glow: 'shadow-[0_0_20px_rgba(56,229,77,0.25)]',
      text: 'text-[#38E54D]',
      icon: <CheckCircle className="w-5 h-5 text-[#38E54D]" />,
      defaultTitle: 'Operación Exitosa',
    },
  }[type];

  return (
    <div
      id={id}
      className={`relative w-full p-4 rounded-[20px] border ${styles.border} ${styles.bg} ${styles.glow} backdrop-blur-md flex items-start gap-3 transition-all duration-300 ${className}`}
    >
      <div className="shrink-0 mt-0.5 p-1 rounded-full bg-white/5">
        {styles.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {ruleCode && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${styles.border} ${styles.text} bg-white/5`}>
              ✦ {ruleCode}
            </span>
          )}
          <h4 className="font-heading font-semibold text-sm text-white">
            {title || styles.defaultTitle}
          </h4>
        </div>
        <p className="text-xs text-[#C8B6E2] mt-1 leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[#C8B6E2] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
