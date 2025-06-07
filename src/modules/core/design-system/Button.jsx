import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white border-0',
    secondary: 'bg-dark-500 hover:bg-dark-600 text-white border-0',
    outline: 'bg-white hover:bg-primary-50 text-primary-500 border-2 border-primary-500',
    ghost: 'bg-transparent hover:bg-primary-50 text-primary-500 border-0',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-13 px-7 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ outline: 'none' }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
