import React from 'react';
import './Button.css';

/**
 * Primary UI component for user interaction
 */
class Button extends React.Component {
  render() {
    const {
      children,
      onClick,
      type = 'button',
      variant = 'primary',
      size = 'medium',
      disabled = false,
      fullWidth = false,
      className = '',
    } = this.props;

    const baseClass = 'button';
    const classes = [
      baseClass,
      `${baseClass}--${variant}`,
      `${baseClass}--${size}`,
      fullWidth ? `${baseClass}--full-width` : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button
        type={type}
        className={classes}
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
      >
        {children}
      </button>
    );
  }
}

// Default props
Button.defaultProps = {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  fullWidth: false,
  className: '',
  onClick: () => {},
};

export default Button;