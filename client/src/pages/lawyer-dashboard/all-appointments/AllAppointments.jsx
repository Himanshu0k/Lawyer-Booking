import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AllAppointments.css";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const token = sessionStorage.getItem("lawyerToken");
        const response = await axios.get("http://localhost:5000/lawyer/appointment/getAppointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching all appointments:", err);
        setError(err.response?.data?.message || "Failed to fetch all appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllAppointments();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading all appointments...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="all-appointments">
      <div className="page-header">
        <h1>All Appointments</h1>
        <button className="back-btn" onClick={() => navigate("/lawyer-dashboard")}>
          Back to Dashboard
        </button>
      </div>
      {appointments.length > 0 ? (
        <div className="appointments-grid">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.bookingCause || "Consultation"}</h3>
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="appointment-details">
                <p>
                  <strong>Client:</strong> {appointment.userId?.name || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(appointment.date)}
                </p>
                <p>
                  <strong>Time:</strong> {appointment.time}
                </p>
                <p>
                  <strong>Booking Cause:</strong> {appointment.bookingCause || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default AllAppointments;
