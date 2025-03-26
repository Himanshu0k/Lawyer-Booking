import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../../components/Button/Button';
import './LawyerLoginPage.css';

const LawyerLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const response = await axios.post("http://localhost:5000/login/lawyer", formData);
        const { token } = response.data.data;

        // Store the lawyer token in localStorage
        localStorage.removeItem("token");
        localStorage.setItem("lawyerToken", token);

        // localStorage.setItem("lawyerToken", token);
        console.log("Lawyer token stored in localStorage:", token); // Debugging log

        alert("Login successful!");
        navigate("/lawyer-dashboard"); // Redirect to lawyer dashboard
      } catch (error) {
        setErrors({ form: error.response?.data?.message || "Invalid email or password" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="login-container">
      <button 
        className="go-back-button" 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >
        Go Back
      </button>
      <div className="login-form-container">
        <h1 className="login-title">Lawyer Log In</h1>
        <p className="login-subtitle">Enter your credentials to access your account</p>
        
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.email && (
              <span id="email-error" className="error-message">{errors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.password && (
              <span id="password-error" className="error-message">{errors.password}</span>
            )}
          </div>
          
          {errors.form && <p className="error-message">{errors.form}</p>}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account? <a href="/signup-lawyer" className="signup-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LawyerLoginPage;