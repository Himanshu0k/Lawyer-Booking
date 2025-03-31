import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import SignUpPage from "./pages/signup-page/user/SignUpPage";
import LoginPage from "./pages/login-page/user/LoginPage";
import LandingPage from "./pages/landing-page/LandingPage";
import LawyerSignupPage from "./pages/signup-page/lawyer/LawyerSignUpPage";
import LawyerDashboard from "./pages/lawyer-dashboard/LawyerDashboard";
import UserDashboard from "./pages/user-dashboard/UserDashboard";
import BookAppointment from "./pages/user-dashboard/book-appointment/BookAppointment";
import LawyerDirectory from "./pages/user-dashboard/lawyers-directory/LawyerDirectory";
import ManageAppointments from "./pages/user-dashboard/my-appointments/ManageAppointments";
import PaymentGateway from "./pages/payment-gateway/PaymentGateway";
import LawyerLoginPage from "./pages/login-page/lawyer/LawyerLoginPage";
import UpdateAppointment from "./pages/user-dashboard/my-appointments/update-appointment/UpdateAppointment";
import PendingAppointments from "./pages/lawyer-dashboard/pending-appointments/PendingAppointments";
import ApprovedAppointments from "./pages/lawyer-dashboard/approved-appointments/ApprovedAppointments";
import AllAppointments from "./pages/lawyer-dashboard/all-appointments/AllAppointments";
import UpdateLawyerDetails from "./pages/lawyer-dashboard/update-lawyer-details/UpdateLawyerDetails";
import ReviewLawyer from "./pages/user-dashboard/my-appointments/review-lawyer/ReviewLawyer";
import LawyerDetails from "./pages/user-dashboard/lawyers-directory/lawyer-details/LawyerDetails";
import AppointmentDetails from "./pages/lawyer-dashboard/pending-appointments/view-appointment-details/AppointmentDetails";

// Set up Axios interceptors to include tokens in the authorization header
axios.interceptors.request.use(
  (config) => {
    // Add user token if available
    const userToken = localStorage.getItem("token");
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    // Add lawyer token if available
    const lawyerToken = localStorage.getItem("lawyerToken");
    if (lawyerToken) {
      config.headers.Authorization = `Bearer ${lawyerToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const App = () => {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup-user" element={<SignUpPage />} />
        <Route path="/login-user" element={<LoginPage />} />
        <Route path="/signup-lawyer" element={<LawyerSignupPage />} />
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/lawyers-directory" element={<LawyerDirectory />} />
        <Route path="/manage-appointments" element={<ManageAppointments />} />
        <Route path="payment-gateway" element={<PaymentGateway />} />
        <Route path="/login-lawyer" element={<LawyerLoginPage />} />
        <Route path="/update-appointment/:appointmentId" element={<UpdateAppointment />} />
        <Route path="/pending-appointments" element={<PendingAppointments />} />
        <Route path="/approved-appointments" element={<ApprovedAppointments />} />
        <Route path="/all-appointments" element={<AllAppointments />} />
        <Route path="/update-lawyer-details" element={<UpdateLawyerDetails />} />
        <Route path="/review-lawyer/:lawyerId" element={<ReviewLawyer />} />
        <Route path="/lawyer-details/:lawyerId" element={<LawyerDetails />} />
        <Route path="/view-appointment-details/:appointmentId" element={<AppointmentDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
