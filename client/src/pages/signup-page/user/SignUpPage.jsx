import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUpPage.css';
import axios from 'axios';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    picturePath: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
        setFormData({
          ...formData,
          picturePath: file.name, // In a real app, you'd upload to server and get URL
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    // DOB validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 20) {
      newErrors.password = 'Password must be less than 20 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const submissionData = { ...formData };
      delete submissionData.confirmPassword;
      submissionData.role = "user";

      try {
        const response = await axios.post("http://localhost:5000/user/addUser", submissionData);
        alert("User signed up successfully!"); // Handle success message
      } catch (error) {
        alert(`Error: ${error.response?.data?.message || "An error occurred"}`); // Handle error message
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="signup-container">
      <button 
        className="go-back-button" 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >
        Go Back
      </button>
      <div className="signup-form-container">
        <h1 className="signup-title">Create Your Account</h1>
        <p className="signup-subtitle">Join JustHire to find legal help</p>

        <div className="avatar-upload-container">
          <div 
            className="avatar-upload" 
            onClick={handleAvatarClick}
            style={{ backgroundImage: avatar ? `url(${avatar})` : 'none' }}
          >
            {!avatar && (
              <div className="avatar-placeholder">
                <i className="avatar-icon">👤</i>
                <span>Add Photo</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
          </div>
          <p className="avatar-help-text">Click to upload your profile photo... Feature not realesed yet</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dob" className="form-label">
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`form-input ${errors.dob ? 'input-error' : ''}`}
                required
              />
              {errors.dob && <span className="error-message">{errors.dob}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter your email address"
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Create a password"
                required
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`form-input ${errors.phoneNumber ? 'input-error' : ''}`}
              placeholder="Enter your phone number"
              required
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address <span className="required">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-textarea ${errors.address ? 'input-error' : ''}`}
              placeholder="Enter your address"
              required
              rows="3"
            ></textarea>
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          {/* <div className="form-group terms-checkbox">
            <label className="checkbox-container">
              <input type="checkbox" required />
              <span className="checkbox-label">
                I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
              </span>
            </label>
          </div> */}

          <div className="form-group lawyer-option">
            <p className="lawyer-option-text">Are you a lawyer? <Link to="/signup-lawyer" className="lawyer-link">Sign up as a lawyer</Link></p>
          </div>

          <button 
            type="submit" 
            className="signup-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login-user" className="login-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;