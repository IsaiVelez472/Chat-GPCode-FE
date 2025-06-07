import React from 'react';

const Select = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
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
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
          error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
        } rounded-md shadow-sm focus:outline-none bg-white text-gray-900 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
