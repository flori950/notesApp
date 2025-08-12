import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ 
  message, 
  type, 
  onClose, 
  duration = 4000 
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="toast-notification">
      <div className={`
        ${getTypeStyles()}
        bg-card backdrop-filter backdrop-blur-xl
        border rounded-2xl shadow-xl px-4 py-3
        max-w-sm min-w-[280px]
        transform transition-all duration-300 ease-out
        animate-slide-in
        relative
      `}>
        <div className="flex items-center gap-3">
          <span className="text-lg flex-shrink-0" role="img" aria-hidden="true">
            {getIcon()}
          </span>
          <p className="font-medium text-sm leading-relaxed flex-1">
            {message}
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 ml-2"
            aria-label="Close notification"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      </div>
    </div>
  );
};
