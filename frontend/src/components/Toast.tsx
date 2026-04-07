
import React, { useEffect } from 'react';
import { CheckIcon } from './icons/MiniIcons';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-white border-secondary/40 text-zinc-800',
    error: 'bg-white border-red-300 text-zinc-800',
    info: 'bg-white border-primary/30 text-zinc-800',
  };

  const icons = {
    success: <CheckIcon className="w-5 h-5 text-secondary" />,
    error: (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-auto md:right-6 z-[100]">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl ${bgColors[type]}`}>
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <p className="text-sm font-medium pr-2">{message}</p>
        <button onClick={onClose} className="ml-2 text-zinc-400 hover:text-zinc-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
