import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LawyerSignupPage.css';

const LawyerSignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    specialization: '', // Added specialization field
    experience: '',
    fees: '',
    picturePath: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const [success, setSuccess] = useState("");
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
    setSuccess("");
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

    // Specialization validation
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
    }

    // Experience validation
    if (!formData.experience) {
      newErrors.experience = 'Experience is required';
    } else if (formData.experience.length < 5) {
      newErrors.experience = 'Experience description must be at least 5 characters';
    }

    // Fees validation
    if (!formData.fees) {
      newErrors.fees = 'Fees are required';
    } else if (isNaN(formData.fees) || Number(formData.fees) <= 0) {
      newErrors.fees = 'Please enter a valid fee amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await axios.post("http://localhost:5000/lawyer/addLawyer", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dob: formData.dob,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          specialization: formData.specialization,
          experience: formData.experience,
          fees: formData.fees,
        });

        setSuccess("Account created successfully!");
        setFormData({
          name: "",
          dob: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          address: "",
          specialization: "",
          experience: "",
          fees: "",
          picturePath: "",
        });
      } catch (error) {
        console.error("Error creating lawyer account:", error);
        setErrors({ form: error.response?.data?.message || "Failed to create account" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="lawyer-signup-container">
      <button 
        className="go-back-button" 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >
        Go Back
      </button>
      <div className="lawyer-signup-form-container">
        <h1 className="lawyer-signup-title">Join JustHire as a Lawyer</h1>
        <p className="lawyer-signup-subtitle">Create your professional profile</p>

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
          <p className="avatar-help-text">Click to upload your professional photo... Feature Not Released yet</p>
        </div>

        <form className="lawyer-signup-form" onSubmit={handleSubmit} noValidate>
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
              Office Address <span className="required">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-textarea ${errors.address ? 'input-error' : ''}`}
              placeholder="Enter your office address"
              required
              rows="3"
            ></textarea>
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="specialization" className="form-label">
              Specialization <span className="required">*</span>
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className={`form-input ${errors.specialization ? 'input-error' : ''}`}
              placeholder="Enter your specialization (e.g., Criminal Law, Family Law)"
              required
            />
            {errors.specialization && <span className="error-message">{errors.specialization}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="experience" className="form-label">
              Professional Experience <span className="required">*</span>
            </label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className={`form-textarea ${errors.experience ? 'input-error' : ''}`}
              placeholder="Describe your professional experience, specializations, and qualifications"
              required
              rows="4"
            ></textarea>
            {errors.experience && <span className="error-message">{errors.experience}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fees" className="form-label">
              Consultation Fees (INR) <span className="required">*</span>
            </label>
            <div className="fee-input-container">
              <span className="fee-currency">₹</span>
              <input
                type="number"
                id="fees"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className={`form-input fee-input ${errors.fees ? 'input-error' : ''}`}
                placeholder="Enter your fees"
                min="1000"
                step="0.01"
                required
              />
            </div>
            {errors.fees && <span className="error-message">{errors.fees}</span>}
          </div>

          <div className="form-group lawyer-option">
            <p className="lawyer-option-text">Are you a User? <Link to="/signup-user" className="lawyer-link">Sign up as a User</Link></p>
          </div>

          {errors.form && <p className="error-message">{errors.form}</p>}
          {success && <p className="success-message">{success}</p>}

          <button 
            type="submit" 
            className="signup-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Lawyer Account'}
          </button>
        </form>

        <div className="lawyer-signup-footer">
          <p>
            Already have an account? <Link to="/login-lawyer" className="login-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LawyerSignupPage;