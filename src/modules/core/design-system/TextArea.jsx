import React from 'react';

const TextArea = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  rows = 3,
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
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className={`appearance-none block w-full px-3 py-2 border ${
          error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none bg-white text-gray-900 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea;
