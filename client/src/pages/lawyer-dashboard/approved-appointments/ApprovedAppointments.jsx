import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ApprovedAppointments.css";

const ApprovedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedAppointments = async () => {
      try {
        const token = sessionStorage.getItem("lawyerToken");
        const response = await axios.get("http://localhost:5000/lawyer/appointment/getAppointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const approvedAppointments = response.data.data.filter(
          (appointment) => appointment.status === "approved"
        );
        setAppointments(approvedAppointments);
        setError(null);
      } catch (err) {
        console.error("Error fetching approved appointments:", err);
        setError(err.response?.data?.message || "Failed to fetch approved appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedAppointments();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading approved appointments...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="approved-appointments">
      <div className="page-header">
        <h1>Approved Appointments</h1>
        <button className="back-btn" onClick={() => navigate("/lawyer-dashboard")}>
          Back to Dashboard
        </button>
      </div>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <p><strong>Client:</strong> {appointment.userId?.name || "N/A"}</p>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Booking Cause:</strong> {appointment.bookingCause || "N/A"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No approved appointments.</p>
      )}
    </div>
  );
};

export default ApprovedAppointments;
