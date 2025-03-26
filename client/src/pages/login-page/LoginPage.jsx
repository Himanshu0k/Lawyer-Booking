// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Button from '../../components/Button/Button';
// import './LoginPage.css';

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate(); // Hook for navigation

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Email validation
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email address is invalid';
//     }
    
//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       setIsSubmitting(true);
      
//       try {
//         const response = await axios.post("http://localhost:5000/login/user", formData); // Corrected endpoint
//         const { token } = response.data.data;

//         // Store the token in localStorage
//         localStorage.setItem("token", token);

//         alert("Login successful!");
//         console.log("User data:", response.data);

//         // Redirect to user dashboard after successful login
//         navigate('/user-dashboard');
//       } catch (error) {
//         setErrors({ form: error.response?.data?.message || "Invalid email or password" });
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-form-container">
//         <h1 className="login-title">Log In</h1>
//         <p className="login-subtitle">Enter your credentials to access your account</p>
        
//         <form className="login-form" onSubmit={handleSubmit} noValidate>
//           <div className="form-group">
//             <label htmlFor="email" className="form-label">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className={`form-input ${errors.email ? 'input-error' : ''}`}
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               aria-describedby={errors.email ? "email-error" : undefined}
//               disabled={isSubmitting}
//             />
//             {errors.email && (
//               <span id="email-error" className="error-message">
//                 {errors.email}
//               </span>
//             )}
//           </div>
          
//           <div className="form-group">
//             <div className="password-label-container">
//               <label htmlFor="password" className="form-label">
//                 Password
//               </label>
//               <a href="#forgot-password" className="forgot-password-link">
//                 Forgot Password?
//               </a>
//             </div>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               className={`form-input ${errors.password ? 'input-error' : ''}`}
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               aria-describedby={errors.password ? "password-error" : undefined}
//               disabled={isSubmitting}
//             />
//             {errors.password && (
//               <span id="password-error" className="error-message">
//                 {errors.password}
//               </span>
//             )}
//           </div>
          
//           {errors.form && <p className="error-message">{errors.form}</p>}

//           <div className="form-group remember-me">
//             <label className="checkbox-container">
//               <input type="checkbox" name="remember" />
//               <span className="checkbox-label">Remember me</span>
//             </label>
//           </div>
          
//           <Button 
//             type="submit" 
//             fullWidth 
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? 'Logging in...' : 'Log In'}
//           </Button>
//         </form>
        
//         <div className="login-footer">
//           <p>
//             Don't have an account? <a href="/signup-user" className="signup-link">Sign up</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;