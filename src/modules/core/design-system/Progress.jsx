import React from 'react';

/**
 * Progress component for displaying progress bars
 * @param {Object} props - Component props
 * @param {number} props.value - The progress value (0-100)
 * @param {string} props.className - Additional classes for the progress container
 * @param {string} props.indicatorClassName - Additional classes for the progress indicator
 * @returns {JSX.Element} Progress component
 */
const Progress = ({ value, className = '', indicatorClassName = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-full ${className}`}>
      <div
        className={`h-full ${indicatorClassName}`}
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  );
};

export default Progress;
