import React, { useState } from 'react';
import './PasswordField.css';

const PasswordField = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  min = 6,
  max = 20,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-field">
      <label htmlFor={id} className="password-label">
        {label} {required && <span className="required-mark">*</span>}
      </label>
      <div className="password-input-container">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`password-control ${error ? 'password-error' : ''}`}
          required={required}
          disabled={disabled}
          aria-describedby={error ? `${id}-error` : undefined}
          minLength={min}
          maxLength={max}
        />
        <button
          type="button"
          className="toggle-password-btn"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <span id={`${id}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordField;