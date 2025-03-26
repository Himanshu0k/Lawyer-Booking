import React from 'react';
import './DatePicker.css';

const DatePicker = ({
  id,
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="date-picker">
      <label htmlFor={id} className="date-label">
        {label} {required && <span className="required-mark">*</span>}
      </label>
      <input
        id={id}
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className={`date-control ${error ? 'date-error' : ''}`}
        required={required}
        disabled={disabled}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
};

export default DatePicker;