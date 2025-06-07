import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'error', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const types = {
    error: 'bg-red-500',
    success: 'bg-primary',
    warning: 'bg-yellow-500'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
      <div className={`${types[type]} text-white pl-6 pr-20 py-4 rounded-lg shadow-lg flex items-center gap-2`}>
        {type === 'error' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span className="">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
