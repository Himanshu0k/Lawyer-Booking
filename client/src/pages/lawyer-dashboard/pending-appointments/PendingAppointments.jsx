import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PendingAppointments.css";

const PendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        const token = sessionStorage.getItem("lawyerToken");
        const response = await axios.get("http://localhost:5000/lawyer/appointment/getAppointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const pendingAppointments = response.data.data.filter(
          (appointment) => appointment.status === "pending"
        );
        setAppointments(pendingAppointments);
        setError(null);
      } catch (err) {
        console.error("Error fetching pending appointments:", err);
        setError(err.response?.data?.message || "Failed to fetch pending appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAppointments();
  }, []);

  const handleApprove = async (appointmentId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/lawyer/appointment/approveAppointment",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      alert("Appointment approved successfully!");
    } catch (err) {
      console.error("Error approving appointment:", err);
      alert(err.response?.data?.message || "Failed to approve appointment.");
    }
  };

  const handleDelete = async (appointmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete("http://localhost:5000/lawyer/appointment/deleteAppointment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { appointmentId },
      });
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      alert("Appointment deleted successfully!");
    } catch (err) {
      console.error("Error deleting appointment:", err);
      alert(err.response?.data?.message || "Failed to delete appointment.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading pending appointments...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="pending-appointments">
      <div className="page-header">
        <h1>Pending Appointments</h1>
        <button className="back-btn" onClick={() => navigate("/lawyer-dashboard")}>
          Back to Dashboard
        </button>
      </div>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id} className="appointment-card">
              <p><strong>Client:</strong> {appointment.userId?.name || "N/A"}</p>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Booking Cause:</strong> {appointment.bookingCause || "N/A"}</p>
              <div className="appointment-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(appointment._id)}
                >
                  Approve
                </button>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/appointment/${appointment._id}`)}
                >
                  View
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(appointment._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending appointments.</p>
      )}
    </div>
  );
};

export default PendingAppointments;
