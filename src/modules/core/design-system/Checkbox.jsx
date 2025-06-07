import React from 'react';

const Checkbox = ({
  id,
  name,
  label,
  checked,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            required={required}
            className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-300 rounded ${className}`}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label htmlFor={id} className="text-dark-700">
              {label} {required && <span className="text-primary-500">*</span>}
            </label>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Checkbox;
