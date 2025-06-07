import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const Input = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-primary-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`appearance-none block w-full px-3 py-2 border ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none bg-white text-gray-900 ${type === 'date' ? 'pr-10' : ''} ${className}`}
          autoComplete="off"
          style={{ WebkitTextFillColor: '#000', WebkitBoxShadow: '0 0 0px 1000px white inset' }}
          {...props}
        />
        {type === 'date' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaCalendarAlt className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
