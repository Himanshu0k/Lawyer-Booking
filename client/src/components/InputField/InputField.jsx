import React from 'react';
import './InputField.css';

const InputField = ({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  min,
  max,
}) => {
  return (
    <div className="input-field">
      <label htmlFor={id} className="input-label">
        {label} {required && <span className="required-mark">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-control ${error ? 'input-error' : ''}`}
        required={required}
        disabled={disabled}
        aria-describedby={error ? `${id}-error` : undefined}
        minLength={min}
        maxLength={max}
      />
      {error && (
        <span id={`${id}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;