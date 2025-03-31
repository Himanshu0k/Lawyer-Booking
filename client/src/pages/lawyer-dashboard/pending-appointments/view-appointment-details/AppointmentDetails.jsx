import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AppointmentDetails.css";

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      const token = sessionStorage.getItem("lawyerToken");
      if (!token) {
        setError("Unauthorized: Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/user/appointment/getAppointment/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointment(response.data.data);
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError(err.response?.data?.message || "Failed to fetch appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);



  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:5000/user/getUserById/${userId}`);
        setUserDetails(response.data.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.response?.data?.message || "Failed to fetch user details.");
      }
    };
    if (appointment?.userId) {
      fetchUserDetails(appointment.userId);
    }
  }, [appointment]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="appointment-details">
      <div className="page-header">
        <h1>Appointment Details</h1>
        <button className="back-btn" onClick={() => navigate("/pending-appointments")}>
          Back to Pending Appointments
        </button>
      </div>
      <div className="details">
        <p><h2><b>Details</b></h2></p>
        <p><strong>Name:</strong> {userDetails?.name || "N/A"}</p>
        <p><strong>Email:</strong> {userDetails?.email || "N/A"}</p>
        <p><strong>Phone:</strong> {userDetails?.phoneNumber || "N/A"}</p>
        <p><strong>Address:</strong> {userDetails?.address || "N/A"}</p>
        <p><strong>Date of Birth:</strong> {userDetails?.dob || "N/A"}</p>
        <p><h2><b>Appointment Details</b></h2></p>
        <p><strong>Date:</strong> {appointment?.date || "N/A"}</p>
        <p><strong>Time:</strong> {appointment?.time || "N/A"}</p>
        <p><strong>Booking Cause:</strong> {appointment?.bookingCause || "N/A"}</p>
        <p><strong>Status:</strong> {appointment?.status || "N/A"}</p>
      </div>
      {/* {userDetails && (
        <div className="user-details">
          <h2>User Details</h2>
          <p><strong>Address:</strong> {userDetails?.address || "N/A"}</p>
          <p><strong>Additional Info:</strong> {userDetails?.additionalInfo || "N/A"}</p>
        </div>
      )} */}
    </div>
  );
};

export default AppointmentDetails;
